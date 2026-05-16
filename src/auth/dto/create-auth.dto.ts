import { IsString, IsEmail, MinLength, IsOptional, IsUUID } from 'class-validator';

export class CreateAuthDto {
  @IsUUID()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;
}
