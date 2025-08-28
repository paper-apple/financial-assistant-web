import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ length: 30 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 30, nullable: true })
  location: string;

  @Column({ type: 'timestamp' })
  datetime: Date;
}