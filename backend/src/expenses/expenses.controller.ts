// expenses.controller.ts
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/auth/current-user.decorator';
import { User } from '@/users/entities/user.entity';

@Controller('expenses')
@UseGuards(JwtAuthGuard) // Проверка токена и извлечение пользователя ({ id: 1, username: "name", ... })
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: User // Вместо const user = request.user
  ) {
    return this.expensesService.create(createExpenseDto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('sortField') sortField?: string,
    @Query('sortDirection') sortDirection?: 'ASC' | 'DESC',
    @Query('keywords') keywords?: string[],
  ) {
    const filters = {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      keywords: keywords || [],
    };

    const sortParams = sortField ? {
      field: sortField,
      direction: sortDirection || 'ASC'
    } : undefined;

    return this.expensesService.findAll(user.id, filters, sortParams);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.expensesService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto, 
    @CurrentUser() user: User
  ) {
    return this.expensesService.update(id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: User
  ) {
    return this.expensesService.remove(id, user.id);
  }

  @Get('keywords/suggest')
  suggestKeywords(
    @CurrentUser() user: User,
    @Query('query') query: string,
    @Query('field') field?: 'title' | 'category' | 'location'
  ) {
    return this.expensesService.suggestKeywords(query, user.id, field);
  }
}