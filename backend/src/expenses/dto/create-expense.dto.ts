// import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateExpenseDto {
//   @IsString()
//   title: string;

//   @IsString()
//   category: string;

//   @IsNumber()
//   price: number;

//   @IsString()
//   @IsOptional()
//   location?: string;

//   @IsDate()
//   @Type(() => Date)
//   datetime: Date;
// }

// create-expense.dto.ts
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
  // @Type(() => Date)
  datetime: Date;
}