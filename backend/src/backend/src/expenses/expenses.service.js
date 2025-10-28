"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./entities/expense.entity");
const categories_service_1 = require("../categories/categories.service");
const locations_service_1 = require("../locations/locations.service");
let ExpensesService = class ExpensesService {
    expenseRepository;
    categoriesService;
    locationsService;
    constructor(expenseRepository, categoriesService, locationsService) {
        this.expenseRepository = expenseRepository;
        this.categoriesService = categoriesService;
        this.locationsService = locationsService;
    }
    async create(createExpenseDto, userId) {
        const category = await this.categoriesService.findOrCreate(createExpenseDto.category);
        const location = await this.locationsService.findOrCreate(createExpenseDto.location);
        const expense = this.expenseRepository.create({
            title: createExpenseDto.title,
            price: createExpenseDto.price,
            datetime: createExpenseDto.datetime,
            user: { id: userId },
            category,
            location,
        });
        return this.expenseRepository.save(expense);
    }
    async findAll(userId, filters, sortParams) {
        const qb = this.expenseRepository
            .createQueryBuilder('expense')
            .leftJoinAndSelect('expense.user', 'user')
            .leftJoinAndSelect('expense.category', 'category')
            .leftJoinAndSelect('expense.location', 'location')
            .where('user.id = :userId', { userId });
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            qb.andWhere('expense.price BETWEEN :min AND :max', {
                min: filters.minPrice ?? 0,
                max: filters.maxPrice ?? Number.MAX_SAFE_INTEGER,
            });
        }
        if (filters?.startDate || filters?.endDate) {
            qb.andWhere('expense.datetime BETWEEN :start AND :end', {
                start: filters.startDate ?? new Date(0),
                end: filters.endDate ?? new Date(),
            });
        }
        const keywords = Array.isArray(filters?.keywords)
            ? filters.keywords
            : typeof filters?.keywords === 'string'
                ? [filters.keywords]
                : [];
        if (keywords.length > 0) {
            qb.andWhere(new typeorm_2.Brackets((qb1) => {
                keywords.forEach((keyword, i) => {
                    const param = `kw${i}`;
                    qb1.orWhere(`expense.title ILIKE :${param}`, { [param]: `%${keyword}%` })
                        .orWhere(`category.name ILIKE :${param}`, { [param]: `%${keyword}%` })
                        .orWhere(`location.name ILIKE :${param}`, { [param]: `%${keyword}%` });
                });
            }));
        }
        if (sortParams) {
            switch (sortParams.field) {
                case 'category':
                    qb.orderBy('category.name', sortParams.direction);
                    break;
                case 'location':
                    qb.orderBy('location.name', sortParams.direction);
                    break;
                default:
                    qb.orderBy(`expense.${sortParams.field}`, sortParams.direction);
            }
        }
        else {
            qb.orderBy('expense.datetime', 'DESC');
        }
        return qb.getMany();
    }
    async findOne(id, userId) {
        const expense = await this.expenseRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user', 'category', 'location'],
        });
        if (!expense) {
            throw new common_1.NotFoundException('Расход не найден');
        }
        return expense;
    }
    async update(id, updateExpenseDto, userId) {
        const expense = await this.findOne(id, userId);
        if (updateExpenseDto.category) {
            expense.category = await this.categoriesService.findOrCreate(updateExpenseDto.category);
        }
        if (updateExpenseDto.location) {
            expense.location = await this.locationsService.findOrCreate(updateExpenseDto.location);
        }
        if (updateExpenseDto.title)
            expense.title = updateExpenseDto.title;
        if (updateExpenseDto.price)
            expense.price = updateExpenseDto.price;
        if (updateExpenseDto.datetime)
            expense.datetime = updateExpenseDto.datetime;
        return this.expenseRepository.save(expense);
    }
    async remove(id, userId) {
        const expense = await this.findOne(id, userId);
        await this.expenseRepository.remove(expense);
    }
    async suggestKeywords(query, userId, field) {
        if (!query || query.trim().length < 2) {
            return [];
        }
        const q = `%${query}%`;
        const queryExact = query;
        const fieldConfigs = {
            title: {
                join: null,
                alias: 'expense',
                column: 'title',
            },
            category: {
                join: ['expense.category', 'category'],
                alias: 'category',
                column: 'name',
            },
            location: {
                join: ['expense.location', 'location'],
                alias: 'location',
                column: 'name',
            },
        };
        const fetchSuggestions = async (join, alias, column) => {
            const qb = this.expenseRepository
                .createQueryBuilder('expense')
                .leftJoin('expense.user', 'user')
                .where('user.id = :userId', { userId });
            if (join) {
                qb.leftJoin(join[0], join[1]);
            }
            qb.andWhere(`${alias}.${column} ILIKE :q`, { q })
                .andWhere(`LOWER(${alias}.${column}) != LOWER(:queryExact)`, { queryExact })
                .select(`DISTINCT ${alias}.${column}`, 'value')
                .limit(15);
            const results = await qb.getRawMany();
            return results.map(r => r.value);
        };
        if (field && field in fieldConfigs) {
            console.log('test');
            const config = fieldConfigs[field];
            return await fetchSuggestions(config.join, config.alias, config.column);
        }
        const allResults = await Promise.all(Object.values(fieldConfigs).map(cfg => fetchSuggestions(cfg.join, cfg.alias, cfg.column)));
        return Array.from(new Set(allResults.flat()));
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categories_service_1.CategoriesService, typeof (_a = typeof locations_service_1.LocationsService !== "undefined" && locations_service_1.LocationsService) === "function" ? _a : Object])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map