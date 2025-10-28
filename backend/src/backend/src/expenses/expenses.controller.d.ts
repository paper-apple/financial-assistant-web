import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, req: any): any;
    findAll(req: any, minPrice?: number, maxPrice?: number, startDate?: Date, endDate?: Date, sortField?: string, sortDirection?: 'ASC' | 'DESC', keywords?: string[]): any;
    findOne(id: number, req: any): any;
    update(id: number, updateExpenseDto: UpdateExpenseDto, req: any): any;
    remove(id: number, req: any): any;
    suggestKeywords(req: any, query: string, field?: 'title' | 'category' | 'location'): any;
}
