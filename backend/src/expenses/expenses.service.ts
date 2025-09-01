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
      user: { id: userId } as any,
      category,
      location,
    });

    return this.expenseRepository.save(expense);
  }

  async findAll(userId: number): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'category', 'location'],
    });
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