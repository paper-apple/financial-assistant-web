// import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
// import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { Expense } from './entities/expense.entity';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @Controller('expenses')
// @UseGuards(JwtAuthGuard) // Защищаем все endpoints контроллера
// export class ExpensesController {
//   constructor(private readonly expensesService: ExpensesService) {}

//   @Post()
//   create(@Body() createExpenseDto: CreateExpenseDto, @Request() req): Promise<Expense> {
//     return this.expensesService.create(createExpenseDto, req.user);
//   }

//   @Get()
//   findAll(
//     @Query('skip') skip: number = 0,
//     @Query('limit') limit: number = 100,
//     @Request() req,
//   ): Promise<Expense[]> {
//     return this.expensesService.findAll(skip, limit, req.user);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number, @Request() req): Promise<Expense> {
//     return this.expensesService.findOne(id, req.user);
//   }

//   @Put(':id')
//   update(
//     @Param('id') id: number,
//     @Body() updateExpenseDto: UpdateExpenseDto,
//     @Request() req
//   ): Promise<Expense> {
//     return this.expensesService.update(id, updateExpenseDto, req.user);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number, @Request() req): Promise<void> {
//     await this.expensesService.remove(id, req.user);
//   }
// }

import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Expense } from './entities/expense.entity';

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
  //   console.log("3")
  //   return this.expensesService.findAll(req.userId);
  // }
  
  @Get()
  findAll(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 100,
  ): Promise<Expense[]> {
    return this.expensesService.findAll(skip, limit);
  }

  // @Get(':id')
  // findOne(@Param('id') id: number, @Req() req) {
  //   return this.expensesService.findOne(id, req.userId);
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto, @Req() req) {
    return this.expensesService.update(id, updateExpenseDto, req.userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: number, @Req() req) {
  //   return this.expensesService.remove(id, req.userId);
  // }

  @Delete(':id')
    remove(@Param('id') id: number) {
    return this.expensesService.remove(id);
  }
}