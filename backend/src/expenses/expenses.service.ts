// expenses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.user', 'user')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.location', 'location')
      .where('user.id = :userId', { userId });

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      qb.andWhere('expense.price BETWEEN :min AND :max', {
        min: filters.minPrice ?? 0,
        max: filters.maxPrice ?? Number.MAX_SAFE_INTEGER,
      });
    }

    if (filters?.startDate || filters?.endDate) {
      qb.andWhere('expense.datetime BETWEEN :start AND :end', {
        start: filters.startDate ?? new Date(0),
        end: filters.endDate ?? new Date(),
      });
    }

    const keywords = Array.isArray(filters?.keywords)
      ? filters.keywords
      : typeof filters?.keywords === 'string'
        ? [filters.keywords]
        : [];

    if (keywords.length > 0) {
      qb.andWhere(
        new Brackets((qb1) => {
          keywords.forEach((keyword, i) => {
            const param = `kw${i}`;
            qb1.orWhere(`expense.title ILIKE :${param}`, { [param]: `%${keyword}%` })
              .orWhere(`category.name ILIKE :${param}`, { [param]: `%${keyword}%` })
              .orWhere(`location.name ILIKE :${param}`, { [param]: `%${keyword}%` });
          });
        })
      );
    }

    if (sortParams) {
      switch (sortParams.field) {
        case 'category':
          qb.orderBy('category.name', sortParams.direction);
          break;
        case 'location':
          qb.orderBy('location.name', sortParams.direction);
          break;
        default:
          qb.orderBy(`expense.${sortParams.field}`, sortParams.direction);
      }
    } else {
      qb.orderBy('expense.datetime', 'DESC');
    }

    return qb.getMany();
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

  async suggestKeywords(
    query: string,
    userId: number,
    field?: 'title' | 'category' | 'location'
  ) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const q = `%${query}%`;
    const queryExact = query;

    const fieldConfigs = {
      title: {
        join: null,
        alias: 'expense',
        column: 'title',
      },
      category: {
        join: ['expense.category', 'category'],
        alias: 'category',
        column: 'name',
      },
      location: {
        join: ['expense.location', 'location'],
        alias: 'location',
        column: 'name',
      },
    };

    const fetchSuggestions = async (
      join: string[] | null,
      alias: string,
      column: string
    ) => {
      const qb = this.expenseRepository
        .createQueryBuilder('expense')
        .leftJoin('expense.user', 'user')
        .where('user.id = :userId', { userId });

      if (join) {
        qb.leftJoin(join[0], join[1]);
      }

      qb.andWhere(`${alias}.${column} ILIKE :q`, { q })
        .andWhere(`LOWER(${alias}.${column}) != LOWER(:queryExact)`, { queryExact })
        .select(`DISTINCT ${alias}.${column}`, 'value')
        .limit(15);

      const results = await qb.getRawMany();
      return results.map(r => r.value);
    };

    if (field && field in fieldConfigs) {
      const config = fieldConfigs[field];
      return await fetchSuggestions(config.join, config.alias, config.column);
    }

    const allResults = await Promise.all(
      Object.values(fieldConfigs).map(cfg =>
        fetchSuggestions(cfg.join, cfg.alias, cfg.column)
      )
    );

    return Array.from(new Set(allResults.flat()));
  }
}