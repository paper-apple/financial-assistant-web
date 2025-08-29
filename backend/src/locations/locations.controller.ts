import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocatioDto: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(createLocatioDto);
  }

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Location> {
    return this.locationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.locationsService.remove(id);
  }
}