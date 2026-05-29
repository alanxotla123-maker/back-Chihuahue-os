import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { SchedulesModule } from './schedules/schedules.module';
import { TrucksModule } from './trucks/trucks.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'chihuahuenos',
      autoLoadEntities: true,
      synchronize: true, // Esto crea las tablas automáticamente (solo para desarrollo)
    }),
    AuthModule,
    LocationsModule,
    SchedulesModule,
    TrucksModule,
    ReservationsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
