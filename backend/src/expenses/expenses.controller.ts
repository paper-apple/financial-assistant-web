import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ): Promise<Expense[]> {
    return this.expensesService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Expense> {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.expensesService.remove(id);
  }
}