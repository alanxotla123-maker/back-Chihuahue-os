import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @IsUUID()
  @IsOptional()
  locationId?: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;
}
