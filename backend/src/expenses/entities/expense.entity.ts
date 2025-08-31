// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity('expenses')
// export class Expense {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 30 })
//   title: string;

//   @Column({ length: 30 })
//   category: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   price: number;

//   @Column({ length: 30, nullable: true })
//   location: string;

//   @Column({ type: 'timestamp' })
//   datetime: Date;
// }

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Location } from '../../locations/entities/location.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, { eager: true, nullable: false })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  // @ManyToOne(() => User, user => user.expenses, { nullable: false })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ length: 30 })
  title: string;

  @ManyToOne(() => Category, { eager: true, nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Location, { eager: true, nullable: false })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'timestamp' })
  datetime: Date;
}