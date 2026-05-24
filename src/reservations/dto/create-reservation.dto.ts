import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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
}
