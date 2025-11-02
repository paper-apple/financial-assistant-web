// create-expense.dto.ts
import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsString()
  location: string;

  @IsDate()
  datetime: Date;
}