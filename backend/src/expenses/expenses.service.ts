// // import { Injectable, NotFoundException } from '@nestjs/common';
// // import { InjectRepository } from '@nestjs/typeorm';
// // import { Repository } from 'typeorm';
// // import { Expense } from './entities/expense.entity';
// // import { CreateExpenseDto } from './dto/create-expense.dto';
// // import { UpdateExpenseDto } from './dto/update-expense.dto';

// // @Injectable()
// // export class ExpensesService {
// //   constructor(
// //     @InjectRepository(Expense)
// //     private readonly expenseRepository: Repository<Expense>,
// //   ) {}

// //   async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
// //     const expense = this.expenseRepository.create(createExpenseDto);
// //     return await this.expenseRepository.save(expense);
// //   }

// //   async findAll(skip: number = 0, limit: number = 100): Promise<Expense[]> {
// //     return await this.expenseRepository.find({
// //       skip,
// //       take: limit,
// //     });
// //   }

// //   async findOne(id: number): Promise<Expense> {
// //     const expense = await this.expenseRepository.findOne({ where: { id } });
// //     if (!expense) {
// //       throw new NotFoundException(`Expense with ID ${id} not found`);
// //     }
// //     return expense;
// //   }

// //   async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
// //     const expense = await this.findOne(id);
// //     Object.assign(expense, updateExpenseDto);
// //     return await this.expenseRepository.save(expense);
// //   }

// //   async remove(id: number): Promise<void> {
// //     const result = await this.expenseRepository.delete(id);
// //     if (result.affected === 0) {
// //       throw new NotFoundException(`Expense with ID ${id} not found`);
// //     }
// //   }
// // }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Expense } from './entities/expense.entity';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { CategoriesService } from '../categories/categories.service';
// import { LocationsService } from '../locations/locations.service';
// import { User } from '../users/entities/user.entity';

// @Injectable()
// export class ExpensesService {
//   constructor(
//     @InjectRepository(Expense)
//     private readonly expenseRepository: Repository<Expense>,
//     private readonly categoriesService: CategoriesService,
//     private readonly locationsService: LocationsService,
//   ) {}

//   // async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
//   //   // Находим или создаем категорию
//   //   let category = await this.categoriesService.findByName(createExpenseDto.category);
//   //   if (!category) {
//   //     category = await this.categoriesService.create({ name: createExpenseDto.category });
//   //   }

//   //   // Находим или создаем место
//   //   let location = await this.locationsService.findByName(createExpenseDto.location);
//   //   if (!location) {
//   //     location = await this.locationsService.create({ name: createExpenseDto.location });
//   //   }

//   //   const expense = this.expenseRepository.create({
//   //     title: createExpenseDto.title,
//   //     price: createExpenseDto.price,
//   //     datetime: createExpenseDto.datetime,
//   //     category,
//   //     location,
//   //   });

//   //   return await this.expenseRepository.save(expense);
//   // }

//   async create(createExpenseDto: CreateExpenseDto, user: User): Promise<Expense> {
//     const category = await this.categoriesService.findOrCreateByName(createExpenseDto.category);
//     const location = await this.locationsService.findOrCreateByName(createExpenseDto.location);

//     const expense = this.expenseRepository.create({
//       title: createExpenseDto.title,
//       price: createExpenseDto.price,
//       datetime: createExpenseDto.datetime,
//       category,
//       location,
//       user, // Добавляем пользователя
//     });

//     return await this.expenseRepository.save(expense);
//   }

//   async findAll(skip: number = 0, limit: number = 100): Promise<Expense[]> {
//     return await this.expenseRepository.find({
//       relations: ['category', 'location'],
//       skip,
//       take: limit,
//       order: { datetime: 'DESC' },
//     });
//   }

//   // async findOne(id: number): Promise<Expense> {
//   //   const expense = await this.expenseRepository.findOne({
//   //     where: { id },
//   //     relations: ['category', 'location'],
//   //   });
//   //   if (!expense) {
//   //     throw new NotFoundException(`Expense with ID ${id} not found`);
//   //   }
//   //   return expense;
//   // }

//   async findOne(id: number, user: User): Promise<Expense> {
//     const expense = await this.expenseRepository.findOne({
//       where: { id, user: { id: user.id } }, // Фильтруем по пользователю
//       relations: ['category', 'location'],
//     });
//     if (!expense) {
//       throw new NotFoundException(`Expense with ID ${id} not found`);
//     }
//     return expense;
//   }

//   // async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
//   //   const expense = await this.findOne(id);
    
//   //   // Обновляем категорию если нужно
//   //   if (updateExpenseDto.category && updateExpenseDto.category !== expense.category.name) {
//   //     let category = await this.categoriesService.findByName(updateExpenseDto.category);
//   //     if (!category) {
//   //       category = await this.categoriesService.create({ name: updateExpenseDto.category });
//   //     }
//   //     expense.category = category;
//   //   }
    
//   //   // Обновляем место если нужно
//   //   if (updateExpenseDto.location && updateExpenseDto.location !== expense.location.name) {
//   //     let location = await this.locationsService.findByName(updateExpenseDto.location);
//   //     if (!location) {
//   //       location = await this.locationsService.create({ name: updateExpenseDto.location });
//   //     }
//   //     expense.location = location;
//   //   }
    
//   //   // Обновляем остальные поля
//   //   if (updateExpenseDto.title) expense.title = updateExpenseDto.title;
//   //   if (updateExpenseDto.price) expense.price = updateExpenseDto.price;
//   //   if (updateExpenseDto.datetime) expense.datetime = updateExpenseDto.datetime;

//   //   return await this.expenseRepository.save(expense);
//   // }

//   async update(id: number, user: User, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
//     const expense = await this.expenseRepository.findOne({
//       where: { id, user: { id: user.id } }, // Фильтруем по пользователю
//       relations: ['category', 'location'],
//     });
    
//     // Обновляем категорию если нужно
//     if (updateExpenseDto.category && updateExpenseDto.category !== expense.category.name) {
//       let category = await this.categoriesService.findByName(updateExpenseDto.category);
//       if (!category) {
//         category = await this.categoriesService.create({ name: updateExpenseDto.category });
//       }
//       expense.category = category;
//     }
    
//     // Обновляем место если нужно
//     if (updateExpenseDto.location && updateExpenseDto.location !== expense.location.name) {
//       let location = await this.locationsService.findByName(updateExpenseDto.location);
//       if (!location) {
//         location = await this.locationsService.create({ name: updateExpenseDto.location });
//       }
//       expense.location = location;
//     }
    
//     // Обновляем остальные поля
//     if (updateExpenseDto.title) expense.title = updateExpenseDto.title;
//     if (updateExpenseDto.price) expense.price = updateExpenseDto.price;
//     if (updateExpenseDto.datetime) expense.datetime = updateExpenseDto.datetime;

//     return await this.expenseRepository.save(expense);
//   }

//   // РЕДАКТИРОВАТЬ
//   async remove(id: number): Promise<void> {
//     const result = await this.expenseRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`Expense with ID ${id} not found`);
//     }
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      // user: { id: userId } as any,
      category,
      location,
    });

    return this.expenseRepository.save(expense);
  }

  // async findAll(userId: number): Promise<Expense[]> {
  //   return this.expenseRepository.find({
  //     where: { user: { id: userId } },
  //     relations: ['user', 'category', 'location'],
  //   });
  // }

  async findAll(skip: number = 0, limit: number = 100): Promise<Expense[]> {
    return await this.expenseRepository.find({
      // relations: ['category', 'location', 'user'],
      relations: ['category', 'location'],
      skip,
      take: limit,
      order: { datetime: 'DESC' },
    });
  }

  // async findOne(id: number, userId: number): Promise<Expense> {
  //   const expense = await this.expenseRepository.findOne({
  //     where: { id, user: { id: userId } },
  //     relations: ['user', 'category', 'location'],
  //   });
    
  //   if (!expense) {
  //     throw new NotFoundException('Расход не найден');
  //   }
    
  //   return expense;
  // }

  //   async findOne(): Promise<Expense> {
  //   const expense = await this.expenseRepository.findOne({
  //     // where: { id, user: { id: userId } },
  //     relations: ['user', 'category', 'location'],
  //   });
    
  //   if (!expense) {
  //     throw new NotFoundException('Расход не найден');
  //   }
    
  //   return expense;
  // }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['category', 'location'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number): Promise<Expense> {
    // const expense = await this.findOne(id, userId);
    const expense = await this.findOne(id);
    
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

  // async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
  //   const expense = await this.findOne(id);
  //   Object.assign(expense, updateExpenseDto);
    
  //   // Обновляем категорию если нужно
  //   if (updateExpenseDto.category && updateExpenseDto.category !== expense.category.name) {
  //     let category = await this.categoriesService.findByName(updateExpenseDto.category);
  //     if (!category) {
  //       category = await this.categoriesService.create({ name: updateExpenseDto.category });
  //     }
  //     expense.category = category;
  //   }
    
  //   // Обновляем место если нужно
  //   if (updateExpenseDto.location && updateExpenseDto.location !== expense.location.name) {
  //     let location = await this.locationsService.findByName(updateExpenseDto.location);
  //     if (!location) {
  //       location = await this.locationsService.create({ name: updateExpenseDto.location });
  //     }
  //     expense.location = location;
  //   }
    
  //   // Обновляем остальные поля
  //   if (updateExpenseDto.title) expense.title = updateExpenseDto.title;
  //   if (updateExpenseDto.price) expense.price = updateExpenseDto.price;
  //   if (updateExpenseDto.datetime) expense.datetime = updateExpenseDto.datetime;

  //   return await this.expenseRepository.save(expense);
  // }

  // async remove(id: number, userId: number): Promise<void> {
  //   const expense = await this.findOne(id, userId);
  //   await this.expenseRepository.remove(expense);
  // }

  async remove(id: number): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}