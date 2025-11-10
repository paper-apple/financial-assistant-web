// categories.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 30, unique: true })
  name: string;

  @OneToMany(() => Expense, 
    expense => expense.category)
  expenses: Expense[];
}