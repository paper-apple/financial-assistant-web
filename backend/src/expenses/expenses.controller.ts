import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';


@Controller('expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req) {
    return this.expensesService.create(createExpenseDto, req.userId);
  }

  // @Get()
  // findAll(@Req() req) {
  //   return this.expensesService.findAll(req.userId);
  // }

  @Get()
    findAll(
      @Req() req,
      // @Query('category') category?: string,
      // @Query('location') location?: string,
      @Query('minPrice') minPrice?: number,
      @Query('maxPrice') maxPrice?: number,
      @Query('startDate') startDate?: Date,
      @Query('endDate') endDate?: Date,
      @Query('sortField') sortField?: string,
      @Query('sortDirection') sortDirection?: 'ASC' | 'DESC',
      @Query('keywords') keywords?: string[], // Массив ключевых слов
    ) {
      const filters = {
        // category,
        // location,
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

      return this.expensesService.findAll(req.userId, filters, sortParams);
    }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    return this.expensesService.findOne(id, req.userId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto, @Req() req) {
    return this.expensesService.update(id, updateExpenseDto, req.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.expensesService.remove(id, req.userId);
  }
}