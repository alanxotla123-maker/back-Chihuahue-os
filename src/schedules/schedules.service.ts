import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  create(dto: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create(dto);
    return this.scheduleRepository.save(schedule);
  }

  findAll() {
    return this.scheduleRepository.find({ relations: ['location'] });
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId: id },
      relations: ['location'],
    });
    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`);
    return schedule;
  }

  // Buscar horarios por locationId y día de la semana
  findByLocationAndDay(locationId: string, dayOfWeek: number) {
    return this.scheduleRepository.find({
      where: { locationId, dayOfWeek },
      order: { departureTime: 'ASC' },
    });
  }

  // Buscar todos los horarios de una location
  findByLocation(locationId: string) {
    return this.scheduleRepository.find({
      where: { locationId },
      order: { dayOfWeek: 'ASC', departureTime: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.preload({
      scheduleId: id,
      ...dto,
    });
    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string) {
    const schedule = await this.findOne(id);
    return this.scheduleRepository.remove(schedule);
  }
}
