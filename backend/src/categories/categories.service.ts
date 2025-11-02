// categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findOrCreate(name: string): Promise<Category> {
    let category = await this.categoriesRepository.findOne({ where: { name } });
    if (!category) {
      category = this.categoriesRepository.create({ name });
      category = await this.categoriesRepository.save(category);
    }
    return category;
  }
}