import { Category } from '../../categories/entities/category.entity';
import { Location } from '../../locations/entities/location.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Expense {
    id: number;
    title: string;
    price: number;
    datetime: Date;
    user: User;
    category: Category;
    location: Location;
}
