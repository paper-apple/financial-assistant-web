import { Category } from '../../categories/entities/category.entity';
import { Location } from '../../locations/entities/location.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp' })
  datetime: Date;

  // @ManyToOne(() => User, user => user.expenses, { nullable: false })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  // @ManyToOne(() => Category, { eager: true, nullable: false })
  // @JoinColumn({ name: 'category_id' })
  // category: Category;

  // @ManyToOne(() => Location, { eager: true, nullable: false })
  // @JoinColumn({ name: 'location_id' })
  // location: Location;

  @ManyToOne(() => User, user => user.expenses)
  user: User;

  @ManyToOne(() => Category, category => category.expenses)
  category: Category;

  @ManyToOne(() => Location, location => location.expenses)
  location: Location;
}