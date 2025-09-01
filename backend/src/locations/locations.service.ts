import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async findOrCreate(name: string): Promise<Location> {
    let location = await this.locationsRepository.findOne({ where: { name } });
    if (!location) {
      location = this.locationsRepository.create({ name });
      location = await this.locationsRepository.save(location);
    }
    return location;
  }
}