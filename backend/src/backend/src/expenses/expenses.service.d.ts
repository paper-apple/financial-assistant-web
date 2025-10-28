import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CategoriesService } from '../categories/categories.service';
import { LocationsService } from '../locations/locations.service';
export declare class ExpensesService {
    private expenseRepository;
    private categoriesService;
    private locationsService;
    constructor(expenseRepository: Repository<Expense>, categoriesService: CategoriesService, locationsService: LocationsService);
    create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense>;
    findAll(userId: number, filters?: {
        minPrice?: number;
        maxPrice?: number;
        startDate?: Date;
        endDate?: Date;
        keywords?: string[];
    }, sortParams?: {
        field: string;
        direction: 'ASC' | 'DESC';
    }): Promise<Expense[]>;
    findOne(id: number, userId: number): Promise<Expense>;
    update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number): Promise<Expense>;
    remove(id: number, userId: number): Promise<void>;
    suggestKeywords(query: string, userId: number, field?: 'title' | 'category' | 'location'): Promise<any[]>;
}
