// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ExpensesService } from './expenses.service';
// import { ExpensesController } from './expenses.controller';
// import { Expense } from './entities/expense.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Expense])],
//   controllers: [ExpensesController],
//   providers: [ExpensesService],
// })
// export class ExpensesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { CategoriesModule } from '../categories/categories.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    CategoriesModule,
    LocationsModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}