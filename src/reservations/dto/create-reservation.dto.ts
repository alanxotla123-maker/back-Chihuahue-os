import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  scheduleId!: string;

  @IsString()
  @IsNotEmpty()
  tripDate!: string; // "YYYY-MM-DD"

  @IsNumber()
  @IsNotEmpty()
  seatNumber!: number;

  @IsString()
  @IsNotEmpty()
  passengerName!: string;

  @IsString()
  @IsOptional()
  lockedByName?: string;
}
