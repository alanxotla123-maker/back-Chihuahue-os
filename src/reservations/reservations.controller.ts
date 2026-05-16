import { Controller, Get, Post, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    try {
      return await this.reservationsService.create(dto);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // GET /reservations/occupied?scheduleId=XXX&date=YYYY-MM-DD
  @Get('occupied')
  getOccupiedSeats(
    @Query('scheduleId') scheduleId: string,
    @Query('date') date: string,
  ) {
    if (!scheduleId || !date) {
      throw new BadRequestException('scheduleId and date are required');
    }
    return this.reservationsService.getOccupiedSeats(scheduleId, date);
  }
}
