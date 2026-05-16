import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
  ) {}

  create(createLocationDto: CreateLocationDto) {
    const location = this.locationRepository.create(createLocationDto);
    return this.locationRepository.save(location);
  }

  findAll() {
    return this.locationRepository.find();
  }

  async findOne(id: string) {
    const location = await this.locationRepository.findOne({ where: { locationId: id } });
    if (!location) throw new NotFoundException(`Location with ID ${id} not found`);
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.preload({
      locationId: id,
      ...updateLocationDto,
    });
    if (!location) throw new NotFoundException(`Location with ID ${id} not found`);
    return this.locationRepository.save(location);
  }

  async remove(id: string) {
    const location = await this.findOne(id);
    return this.locationRepository.remove(location);
  }
}
