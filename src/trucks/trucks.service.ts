import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>,
  ) {}

  create(dto: CreateTruckDto) {
    const truck = this.truckRepository.create(dto);
    return this.truckRepository.save(truck);
  }

  findAll() {
    return this.truckRepository.find({ relations: ['schedules'] });
  }

  async findOne(id: string) {
    const truck = await this.truckRepository.findOne({
      where: { truckId: id },
      relations: ['schedules'],
    });
    if (!truck) throw new NotFoundException(`Camión ${id} no encontrado`);
    return truck;
  }

  async update(id: string, dto: UpdateTruckDto) {
    const truck = await this.truckRepository.preload({
      truckId: id,
      ...dto,
    });
    if (!truck) throw new NotFoundException(`Camión ${id} no encontrado`);
    return this.truckRepository.save(truck);
  }



  async remove(id: string) {
    const truck = await this.findOne(id);
    return this.truckRepository.remove(truck);
  }
}
