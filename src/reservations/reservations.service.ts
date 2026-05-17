import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto) {
    // Check if the seat is already taken
    const existing = await this.reservationRepo.findOne({
      where: {
        scheduleId: dto.scheduleId,
        tripDate: dto.tripDate,
        seatNumber: dto.seatNumber,
        status: 'booked'
      }
    });

    if (existing) {
      throw new Error('Seat already booked');
    }

    const reservation = this.reservationRepo.create(dto);
    return this.reservationRepo.save(reservation);
  }

  // Returns array of occupied seat numbers for a specific schedule and date
  async getOccupiedSeats(scheduleId: string, tripDate: string): Promise<number[]> {
    const reservations = await this.reservationRepo.find({
      where: { scheduleId, tripDate, status: 'booked' },
      select: ['seatNumber']
    });

    return reservations.map(r => r.seatNumber);
  }

  // Get all reservations for a specific user
  async findByUser(passengerName: string) {
    return this.reservationRepo.find({
      where: { passengerName },
      relations: ['schedule', 'schedule.location'],
      order: { tripDate: 'DESC' }
    });
  }
}
