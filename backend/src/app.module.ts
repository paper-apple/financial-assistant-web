// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpensesModule } from './expenses/expenses.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Expense } from './expenses/entities/expense.entity';
import { Category } from './categories/entities/category.entity';
import { Location } from './locations/entities/location.entity';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller'; // Добавьте импорт


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Expense, Category, Location, User],
      synchronize: true,
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
    }),
    ExpensesModule,
    CategoriesModule,
    LocationsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}