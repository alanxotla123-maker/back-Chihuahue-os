import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  truckNumber: string; // "CH-001"

  @IsString()
  model: string; // "Volvo 9800"

  @IsString()
  plateNumber: string;

  @IsNumber()
  @Min(1)
  totalSeats: number;


  @IsString()
  @IsOptional()
  status?: string; // "activo", "en_mantenimiento", "fuera_de_servicio"
}
