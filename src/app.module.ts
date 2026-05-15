import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [AuthModule, EmployeesModule, LocationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
