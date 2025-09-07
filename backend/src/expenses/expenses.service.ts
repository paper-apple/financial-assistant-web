import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Brackets, FindManyOptions, FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
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

  // async findAll(
  //   userId: number,
  //   filters?: {
  //     minPrice?: number;
  //     maxPrice?: number;
  //     startDate?: Date;
  //     endDate?: Date;
  //     keywords?: string[];
  //   },
  //   sortParams?: {
  //     field: string;
  //     direction: 'ASC' | 'DESC';
  //   }
  // ): Promise<Expense[]> {
  //   // Создаем условия для фильтрации
  //   const where: FindOptionsWhere<Expense>[] = [{ user: { id: userId } }];

  //   if (filters) {
  //     const keywords = filters.keywords;
      
  //     const normalizedKeywords = Array.isArray(keywords)
  //       ? keywords
  //       : typeof keywords === 'string'
  //         ? [keywords]
  //         : [];
          
  //     if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
  //       where[0].price = Between(
  //         filters.minPrice || 0,
  //         filters.maxPrice || Number.MAX_SAFE_INTEGER
  //       );
  //     }
  //     if (filters.startDate || filters.endDate) {
  //       where[0].datetime = Between(
  //         filters.startDate || new Date(0),
  //         filters.endDate || new Date()
  //       );
  //     }

  //     // Поиск по ключевым словам
  //     if (filters.keywords !== undefined && filters.keywords.length > 0) {
  //       // Создаем условия для каждого ключевого слова
  //       const keywordConditions = normalizedKeywords.flatMap(keyword => [
  //         // Поиск по названию
  //         { 
  //           user: { id: userId },
  //           title: ILike(`%${keyword}%`)
  //         },
  //         // Поиск по категории
  //         { 
  //           user: { id: userId },
  //           category: { name: ILike(`%${keyword}%`) }
  //         },
  //         // Поиск по месту
  //         { 
  //           user: { id: userId },
  //           location: { name: ILike(`%${keyword}%`) }
  //         }
  //       ]);

  //       // Объединяем все условия поиска
  //       console.log(keywordConditions)
  //       where.push(...keywordConditions);
  //     }
  //   }

  //   // Определяем порядок сортировки
  //   let order: any = {};
  //   if (sortParams) {
  //     switch (sortParams.field) {
  //   case 'category':
  //     order = { category: { name: sortParams.direction } };
  //     break;
  //   case 'location':
  //     order = { location: { name: sortParams.direction } };
  //     break;
  //   default:
  //     order = { [sortParams.field]: sortParams.direction };
  // }
  //   } else {
  //     // Сортировка по умолчанию
  //     order = { datetime: 'DESC' };
  //   }

  //   const options: FindManyOptions<Expense> = {
  //     where: where.length > 1 ? where : where[0],
  //     relations: ['user', 'category', 'location'],
  //     order,
  //   };

  //   return this.expenseRepository.find(options);
  // }


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

    // --- Фильтр по цене ---
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      qb.andWhere('expense.price BETWEEN :min AND :max', {
        min: filters.minPrice ?? 0,
        max: filters.maxPrice ?? Number.MAX_SAFE_INTEGER,
      });
    }

    // --- Фильтр по дате ---
    if (filters?.startDate || filters?.endDate) {
      qb.andWhere('expense.datetime BETWEEN :start AND :end', {
        start: filters.startDate ?? new Date(0),
        end: filters.endDate ?? new Date(),
      });
    }

    // --- Поиск по ключевым словам ---
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

    // --- Сортировка ---
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

  async suggestKeywords(query: string, userId: number) {
  // const userId = req.userId; // или откуда ты его получаешь

  if (!query || query.trim().length < 2) {
    return [];
  }

  // const qb = this.expenseRepository
  //   .createQueryBuilder('expense')
  //   .leftJoin('expense.user', 'user')
  //   .leftJoin('expense.category', 'category')
  //   .leftJoin('expense.location', 'location')
  //   .select([
  //     'DISTINCT expense.title AS title',
  //     'category.name AS categoryName',
  //     'location.name AS locationName',
  //   ])
  //   .where('user.id = :userId', { userId })
  //   .andWhere(
  //     new Brackets(qb1 => {
  //       qb1.where('expense.title ILIKE :q', { q: `%${query}%` })
  //          .orWhere('category.name ILIKE :q', { q: `%${query}%` })
  //          .orWhere('location.name ILIKE :q', { q: `%${query}%` });
  //     })
  //   )
  //   .limit(15);

  // const rawResults = await qb.getRawMany();

  // // Собираем все найденные значения в один массив
  // const allValues = [
  //   ...rawResults.map(r => r.title).filter(Boolean),
  //   ...rawResults.map(r => r.categoryName).filter(Boolean),
  //   ...rawResults.map(r => r.locationName).filter(Boolean),
  // ];

  // Убираем дубликаты
  // return Array.from(new Set(allValues));
const titles = await this.expenseRepository
  .createQueryBuilder('expense')
  .leftJoin('expense.user', 'user')
  .where('user.id = :userId', { userId })
  .andWhere('expense.title ILIKE :q', { q: `%${query}%` })
  .select('DISTINCT expense.title', 'value')
  .getRawMany();

const categories = await this.expenseRepository
  .createQueryBuilder('expense')
  .leftJoin('expense.user', 'user')
  .leftJoin('expense.category', 'category')
  .where('user.id = :userId', { userId })
  .andWhere('category.name ILIKE :q', { q: `%${query}%` })
  .select('DISTINCT category.name', 'value')
  .getRawMany();

const locations = await this.expenseRepository
  .createQueryBuilder('expense')
  .leftJoin('expense.user', 'user')
  .leftJoin('expense.location', 'location')
  .where('user.id = :userId', { userId })
  .andWhere('location.name ILIKE :q', { q: `%${query}%` })
  .select('DISTINCT location.name', 'value')
  .getRawMany();

return Array.from(new Set([
  ...titles.map(r => r.value),
  ...categories.map(r => r.value),
  ...locations.map(r => r.value),
]));

  }
}