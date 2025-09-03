import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CategoriesService } from '../categories/categories.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private categoriesService: CategoriesService,
    private locationsService: LocationsService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense> {
    const category = await this.categoriesService.findOrCreate(createExpenseDto.category);
    const location = await this.locationsService.findOrCreate(createExpenseDto.location);

    const expense = this.expenseRepository.create({
      title: createExpenseDto.title,
      price: createExpenseDto.price,
      datetime: createExpenseDto.datetime,
      user: { id: userId } as any,
      category,
      location,
    });

    return this.expenseRepository.save(expense);
  }

  async findAll(
    userId: number,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      startDate?: Date;
      endDate?: Date;
      keywords?: string[];
    },
    sortParams?: {
      field: string;
      direction: 'ASC' | 'DESC';
    }
  ): Promise<Expense[]> {
    // Создаем условия для фильтрации
    const where: FindOptionsWhere<Expense>[] = [{ user: { id: userId } }];
    
    console.log('get')
    if (filters) {
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where[0].price = Between(
          filters.minPrice || 0,
          filters.maxPrice || Number.MAX_SAFE_INTEGER
        );
      }
      if (filters.startDate || filters.endDate) {
        where[0].datetime = Between(
          filters.startDate || new Date(0),
          filters.endDate || new Date()
        );
      }

      // Поиск по ключевым словам
      if (filters.keywords !== undefined && filters.keywords.length > 0) {
        // Создаем условия для каждого ключевого слова
        const keywordConditions = filters.keywords.flatMap(keyword => [
          // Поиск по названию
          { 
            user: { id: userId },
            title: ILike(`%${keyword}%`)
          },
          // Поиск по категории
          { 
            user: { id: userId },
            category: { name: ILike(`%${keyword}%`) }
          },
          // Поиск по месту
          { 
            user: { id: userId },
            location: { name: ILike(`%${keyword}%`) }
          }
        ]);

        // Объединяем все условия поиска
        where.push(...keywordConditions);
      }
    }

    // Определяем порядок сортировки
    let order: any = {};
    if (sortParams) {
      // Преобразуем поле для сортировки в правильный формат
      // let fieldName: string;
      // switch (sortParams.field) {
      //   case 'category':
      //     fieldName = 'category.name';
      //     break;
      //   case 'location':
      //     fieldName = 'location.name';
      //     break;
      //   default:
      //     fieldName = `expense.${sortParams.field}`;
      // }

      switch (sortParams.field) {
    case 'category':
      order = { category: { name: sortParams.direction } };
      break;
    case 'location':
      order = { location: { name: sortParams.direction } };
      break;
    default:
      order = { [sortParams.field]: sortParams.direction };
  }
    } else {
      // Сортировка по умолчанию
      order = { datetime: 'DESC' };
    }

    const options: FindManyOptions<Expense> = {
      where: where.length > 1 ? where : where[0],
      relations: ['user', 'category', 'location'],
      order,
    };

    return this.expenseRepository.find(options);
  }

  async findOne(id: number, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'category', 'location'],
    });
    
    if (!expense) {
      throw new NotFoundException('Расход не найден');
    }
    
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    
    if (updateExpenseDto.category) {
      expense.category = await this.categoriesService.findOrCreate(updateExpenseDto.category);
    }
    
    if (updateExpenseDto.location) {
      expense.location = await this.locationsService.findOrCreate(updateExpenseDto.location);
    }
    
    if (updateExpenseDto.title) expense.title = updateExpenseDto.title;
    if (updateExpenseDto.price) expense.price = updateExpenseDto.price;
    if (updateExpenseDto.datetime) expense.datetime = updateExpenseDto.datetime;

    return this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expenseRepository.remove(expense);
  }
}