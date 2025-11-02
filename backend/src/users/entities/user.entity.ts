// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true, length: 30 })
  username: string;

  @Column("varchar")
  password: string;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];
}