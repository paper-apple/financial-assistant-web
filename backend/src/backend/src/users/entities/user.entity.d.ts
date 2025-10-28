import { Expense } from '../../expenses/entities/expense.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    expenses: Expense[];
}
