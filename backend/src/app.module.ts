// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ExpensesModule } from './expenses/expenses.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'postgres',
//       database: 'finance_db',
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true,
//     }),
//     ExpensesModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesModule } from './expenses/expenses.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { Expense } from './expenses/entities/expense.entity';
import { Category } from './categories/entities/category.entity';
import { Location } from './locations/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'expenses_db',
      entities: [Expense, Category, Location],
      synchronize: true, // Только для разработки
      // autoLoadEntities: true, // Добавьте эту строку
    }),
    ExpensesModule,
    CategoriesModule,
    LocationsModule,
  ],
})
export class AppModule {}