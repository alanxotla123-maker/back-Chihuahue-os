import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async create(dto: CreateScheduleDto) {
    if (dto.daysOfWeek && dto.daysOfWeek.length > 0) {
      const createdSchedules: Schedule[] = [];
      const { daysOfWeek, ...rest } = dto;
      for (const day of dto.daysOfWeek) {
        const schedule = this.scheduleRepository.create({
          ...rest,
          dayOfWeek: day,
        });
        const saved = await this.scheduleRepository.save(schedule);
        createdSchedules.push(saved);
      }
      return createdSchedules;
    }

    if (dto.dayOfWeek === undefined) {
      throw new BadRequestException('Debe proporcionar dayOfWeek o daysOfWeek.');
    }

    const { daysOfWeek, ...rest } = dto;
    const schedule = this.scheduleRepository.create(rest as any);
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
