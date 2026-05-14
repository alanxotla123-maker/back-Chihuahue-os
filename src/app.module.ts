import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [RoutesModule, TicketsModule, AuthModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
