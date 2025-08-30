import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ExpensesService } from '../expenses.service';
// import { Expense } from './entities/expense.entity';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
import { NotFoundException } from '@nestjs/common';
// import { CategoriesService } from '../categories/categories.service';
// import { LocationsService } from '../locations/locations.service';
// import { Category } from '../categories/entities/category.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Location } from 'src/locations/entities/location.entity';
import { ExpensesService } from 'src/expenses/expenses.service';
import { CategoriesService } from 'src/categories/categories.service';
import { LocationsService } from 'src/locations/locations.service';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/expenses/dto/update-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseRepository: Repository<Expense>;
  let categoriesService: CategoriesService;
  let locationsService: LocationsService;

  const mockCategory: Category = {
    id: 1,
    name: 'Food',
    expenses: [],
  };

  const mockLocation: Location = {
    id: 1,
    name: 'Supermarket',
    expenses: [],
  };

  const mockExpense: Expense = {
    id: 1,
    title: 'Test Expense',
    category: mockCategory,
    price: 10.99,
    location: mockLocation,
    datetime: new Date('2023-01-01T12:00:00Z'),
  };

  const mockExpenses: Expense[] = [mockExpense];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              id: Date.now(),
            })),
            save: jest.fn().mockImplementation((expense) => Promise.resolve(expense)),
            find: jest.fn().mockResolvedValue(mockExpenses),
            findOne: jest.fn().mockImplementation((options) => {
              if (options.where.id === 1) {
                return Promise.resolve(mockExpense);
              }
              return Promise.resolve(null);
            }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findByName: jest.fn().mockImplementation((name) => {
              return name === 'Food' ? Promise.resolve(mockCategory) : Promise.resolve(null);
            }),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
            findOrCreateByName: jest.fn().mockImplementation((name) => {
              return name === 'Food' 
                ? Promise.resolve(mockCategory) 
                : Promise.resolve({ id: Date.now(), name, expenses: [] });
            }),
          },
        },
        {
          provide: LocationsService,
          useValue: {
            findByName: jest.fn().mockImplementation((name) => {
              return name === 'Supermarket' ? Promise.resolve(mockLocation) : Promise.resolve(null);
            }),
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: Date.now(), ...dto })),
            findOrCreateByName: jest.fn().mockImplementation((name) => {
              return name === 'Supermarket' 
                ? Promise.resolve(mockLocation) 
                : Promise.resolve({ id: Date.now(), name, expenses: [] });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseRepository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
    categoriesService = module.get<CategoriesService>(CategoriesService);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense with existing category and location', async () => {
      const createExpenseDto: CreateExpenseDto = {
        title: 'Test Expense',
        category: 'Food',
        price: 10.99,
        location: 'Supermarket',
        datetime: new Date('2023-01-01T12:00:00Z'),
      };

      const result = await service.create(createExpenseDto);
      
      expect(categoriesService.findByName).toHaveBeenCalledWith('Food');
      expect(locationsService.findByName).toHaveBeenCalledWith('Supermarket');
      expect(expenseRepository.create).toHaveBeenCalled();
      expect(expenseRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        title: 'Test Expense',
        price: 10.99,
      }));
    });

    it('should create a new expense with new category and location', async () => {
      const createExpenseDto: CreateExpenseDto = {
        title: 'Test Expense',
        category: 'Transport',
        price: 5.5,
        location: 'Bus',
        datetime: new Date('2023-01-01T12:00:00Z'),
      };

      const result = await service.create(createExpenseDto);
      
      expect(categoriesService.findByName).toHaveBeenCalledWith('Transport');
      expect(categoriesService.create).toHaveBeenCalledWith({ name: 'Transport' });
      expect(locationsService.findByName).toHaveBeenCalledWith('Bus');
      expect(locationsService.create).toHaveBeenCalledWith({ name: 'Bus' });
      expect(expenseRepository.create).toHaveBeenCalled();
      expect(expenseRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of expenses with relations', async () => {
      jest.spyOn(expenseRepository, 'find').mockResolvedValueOnce(mockExpenses);
      
      const result = await service.findAll();
      
      expect(expenseRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'location'],
        skip: 0,
        take: 100,
        order: { datetime: 'DESC' },
      });
      expect(result).toEqual(mockExpenses);
    });

    it('should return expenses with skip and limit', async () => {
      const skip = 1;
      const limit = 10;
      
      await service.findAll(skip, limit);
      
      expect(expenseRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'location'],
        skip,
        take: limit,
        order: { datetime: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an expense by id with relations', async () => {
      const result = await service.findOne(1);
      
      expect(expenseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'location'],
      });
      expect(result).toEqual(mockExpense);
    });

    it('should throw NotFoundException if expense not found', async () => {
      jest.spyOn(expenseRepository, 'findOne').mockResolvedValueOnce(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense with existing category and location', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        title: 'Updated Expense',
        category: 'Food',
        price: 15.99,
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockExpense);
      jest.spyOn(expenseRepository, 'save').mockResolvedValueOnce({
        ...mockExpense,
        ...updateExpenseDto,
      });

      const result = await service.update(1, updateExpenseDto);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(expenseRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Expense');
      expect(result.price).toBe(15.99);
    });

    it('should update an expense with new category and location', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        category: 'Transport',
        location: 'Bus',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockExpense);

      const result = await service.update(1, updateExpenseDto);
      
      expect(categoriesService.findOrCreateByName).toHaveBeenCalledWith('Transport');
      expect(locationsService.findOrCreateByName).toHaveBeenCalledWith('Bus');
      expect(expenseRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      await service.remove(1);
      
      expect(expenseRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if expense not found', async () => {
      jest.spyOn(expenseRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as any);
      
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});