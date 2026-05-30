import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  private getTodayString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Purchase/Book a seat (transforms a locked seat to booked, or books directly)
  async create(dto: CreateReservationDto) {
    const today = this.getTodayString();
    if (dto.tripDate < today) {
      throw new BadRequestException('No se pueden realizar reservaciones para fechas pasadas.');
    }

    // Check if the seat is already booked, or locked by someone ELSE
    const existing = await this.reservationRepo.findOne({
      where: [
        { scheduleId: dto.scheduleId, tripDate: dto.tripDate, seatNumber: dto.seatNumber, status: 'booked' },
        { scheduleId: dto.scheduleId, tripDate: dto.tripDate, seatNumber: dto.seatNumber, status: 'locked', expiresAt: MoreThan(new Date()) }
      ]
    });

    const lockOwner = dto.lockedByName || dto.passengerName;

    if (existing && existing.status === 'locked' && existing.passengerName === lockOwner) {
      // It's locked by THIS user. Upgrade to booked and update name if needed.
      existing.status = 'booked';
      existing.passengerName = dto.passengerName;
      existing.expiresAt = null;
      return this.reservationRepo.save(existing);
    } else if (existing) {
      throw new Error('Seat already booked or locked by another user');
    }

    // Direct booking (if not locked previously)
    const reservation = this.reservationRepo.create({ ...dto, status: 'booked', expiresAt: null });
    return this.reservationRepo.save(reservation);
  }

  // Lock a seat for 5 minutes
  async lockSeat(dto: CreateReservationDto) {
    const today = this.getTodayString();
    if (dto.tripDate < today) {
      throw new BadRequestException('No se pueden realizar reservaciones para fechas pasadas.');
    }

    // Delete any expired locks globally (cleanup) to avoid clutter
    await this.reservationRepo.delete({ status: 'locked', expiresAt: LessThanOrEqual(new Date()) });

    // Check if the seat is taken (booked or actively locked)
    const existing = await this.reservationRepo.findOne({
      where: [
        { scheduleId: dto.scheduleId, tripDate: dto.tripDate, seatNumber: dto.seatNumber, status: 'booked' },
        { scheduleId: dto.scheduleId, tripDate: dto.tripDate, seatNumber: dto.seatNumber, status: 'locked', expiresAt: MoreThan(new Date()) }
      ]
    });

    if (existing) {
      if (existing.passengerName === dto.passengerName) {
        // Refresh lock if it's the same user
        existing.expiresAt = new Date(Date.now() + 5 * 60000);
        return this.reservationRepo.save(existing);
      }
      throw new Error('Seat is not available');
    }

    const reservation = this.reservationRepo.create({
      ...dto,
      status: 'locked',
      expiresAt: new Date(Date.now() + 5 * 60000) // 5 minutes from now
    });
    return this.reservationRepo.save(reservation);
  }

  // Unlock a seat if the user cancels
  async unlockSeat(dto: CreateReservationDto) {
    return this.reservationRepo.delete({
      scheduleId: dto.scheduleId,
      tripDate: dto.tripDate,
      seatNumber: dto.seatNumber,
      passengerName: dto.passengerName,
      status: 'locked'
    });
  }

  // Returns array of occupied/locked seat numbers for a specific schedule and date
  async getOccupiedSeats(scheduleId: string, tripDate: string): Promise<number[]> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!scheduleId || !uuidRegex.test(scheduleId)) {
      return [];
    }

    // Cleanup expired locks first
    await this.reservationRepo.delete({ status: 'locked', expiresAt: LessThanOrEqual(new Date()) });

    const reservations = await this.reservationRepo.find({
      where: [
        { scheduleId, tripDate, status: 'booked' },
        { scheduleId, tripDate, status: 'locked', expiresAt: MoreThan(new Date()) }
      ],
      select: ['seatNumber']
    });

    return reservations.map(r => r.seatNumber);
  }

  // Get all reservations for a specific user
  async findByUser(passengerName: string) {
    return this.reservationRepo.find({
      where: { passengerName, status: 'booked' },
      relations: ['schedule', 'schedule.location', 'schedule.truck'],
      order: { tripDate: 'DESC' }
    });
  }
}
