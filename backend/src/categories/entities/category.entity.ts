import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  name: string;

  @OneToMany(() => Expense, 
    expense => expense.category) // Связь с нужным полем в Expense
  expenses: Expense[]; // Массив всех расходов связанных с этой категорией
}