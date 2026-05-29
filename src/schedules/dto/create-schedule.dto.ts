import { IsString, IsNumber, IsOptional, Min, IsArray } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  locationId: string;

  @IsString()
  @IsOptional()
  truckId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  dayOfWeek?: number; // 0-6

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  daysOfWeek?: number[];

  @IsString()
  departureTime: string; // "08:00"

  @IsString()
  arrivalTime: string; // "12:30"

  @IsString()
  duration: string; // "4h 30m"

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  availableSeats?: number;

  @IsNumber()
  @IsOptional()
  stops?: number;

  @IsString()
  @IsOptional()
  stopsDescription?: string;
}
