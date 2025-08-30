import { Test, TestingModule } from '@nestjs/testing';
import { CreateExpenseDto } from 'src/expenses/dto/create-expense.dto';
import { UpdateExpenseDto } from 'src/expenses/dto/update-expense.dto';
import { Expense } from 'src/expenses/entities/expense.entity';
import { ExpensesController } from 'src/expenses/expenses.controller';
import { ExpensesService } from 'src/expenses/expenses.service';
import { Category } from '../src/categories/entities/category.entity';
import { Location } from '../src/locations/entities/location.entity';
// // import { ExpensesController } from './expenses.controller';
// // import { ExpensesService } from './expenses.service';
// // import { CreateExpenseDto } from './dto/create-expense.dto';
// // import { UpdateExpenseDto } from './dto/update-expense.dto';
// // import { Expense } from './entities/expense.entity';

// describe('ExpensesController', () => {
//   let controller: ExpensesController;
//   let service: ExpensesService;

//   const mockCategory: Category = {
//     id: 1,
//     name: 'Food',
//     expenses: [],
//   };

//   const mockLocation: Location = {
//     id: 1,
//     name: 'Supermarket',
//     expenses: [],
//   };

//   const mockExpense: Expense = {
//     id: 1,
//     title: 'Test Expense',
//     category: mockCategory,
//     price: 10.99,
//     location: mockLocation,
//     datetime: new Date('2023-01-01T12:00:00Z'),
//   };

//   const mockExpenses: Expense[] = [mockExpense];

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ExpensesController],
//       providers: [
//         {
//           provide: ExpensesService,
//           useValue: {
//             create: jest.fn().mockResolvedValue(mockExpense),
//             findAll: jest.fn().mockResolvedValue(mockExpenses),
//             findOne: jest.fn().mockResolvedValue(mockExpense),
//             update: jest.fn().mockResolvedValue(mockExpense),
//             remove: jest.fn().mockResolvedValue(undefined),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<ExpensesController>(ExpensesController);
//     service = module.get<ExpensesService>(ExpensesService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create an expense', async () => {
//       const createExpenseDto: CreateExpenseDto = {
//         title: 'Test Expense',
//         category: 'Food',
//         price: 10.99,
//         location: 'Supermarket',
//         datetime: new Date('2023-01-01T12:00:00Z'),
//       };

//       const result = await controller.create(createExpenseDto);
      
//       expect(service.create).toHaveBeenCalledWith(createExpenseDto);
//       expect(result).toEqual(mockExpense);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of expenses', async () => {
//       const result = await controller.findAll();
      
//       expect(service.findAll).toHaveBeenCalled();
//       expect(result).toEqual(mockExpenses);
//     });

//     it('should support pagination', async () => {
//       const skip = 1;
//       const limit = 10;
      
//       await controller.findAll(skip, limit);
      
//       expect(service.findAll).toHaveBeenCalledWith(skip, limit);
//     });
//   });

//   describe('findOne', () => {
//     it('should return an expense by id', async () => {
//       const result = await controller.findOne('1');
      
//       expect(service.findOne).toHaveBeenCalledWith(1);
//       expect(result).toEqual(mockExpense);
//     });
//   });

//   describe('update', () => {
//     it('should update an expense', async () => {
//       const updateExpenseDto: UpdateExpenseDto = {
//         title: 'Updated Expense',
//       };

//       const result = await controller.update('1', updateExpenseDto);
      
//       expect(service.update).toHaveBeenCalledWith(1, updateExpenseDto);
//       expect(result).toEqual(mockExpense);
//     });
//   });

//   describe('remove', () => {
//     it('should remove an expense', async () => {
//       await controller.remove('1');
      
//       expect(service.remove).toHaveBeenCalledWith(1);
//     });
//   });
// });

// import { Test, TestingModule } from '@nestjs/testing';
// import { ExpensesController } from './expenses.controller';
// import { ExpensesService } from './expenses.service';
// import { CreateExpenseDto } from './dto/create-expense.dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';
// import { Expense } from './entities/expense.entity';
// import { Category } from '../categories/entities/category.entity';
// import { Location } from '../locations/entities/location.entity';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  // Создаем mock объекты для категории и места
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
    category: mockCategory, // Теперь это объект Category
    price: 10.99,
    location: mockLocation, // Теперь это объект Location
    datetime: new Date('2023-01-01T12:00:00Z'),
  };

  const mockExpenses: Expense[] = [mockExpense];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateExpenseDto) => {
              // Преобразуем DTO в Expense объект
              return Promise.resolve({
                id: 1,
                title: dto.title,
                category: { id: 1, name: dto.category, expenses: [] },
                price: dto.price,
                location: { id: 1, name: dto.location, expenses: [] },
                datetime: dto.datetime,
              });
            }),
            findAll: jest.fn().mockResolvedValue(mockExpenses),
            findOne: jest.fn().mockResolvedValue(mockExpense),
            update: jest.fn().mockImplementation((id: number, dto: UpdateExpenseDto) => {
              // Обновляем только переданные поля
              const updated = { ...mockExpense };
              if (dto.title) updated.title = dto.title;
              if (dto.price) updated.price = dto.price;
              if (dto.datetime) updated.datetime = dto.datetime;
              if (dto.category) updated.category = { id: 2, name: dto.category, expenses: [] };
              if (dto.location) updated.location = { id: 2, name: dto.location, expenses: [] };
              return Promise.resolve(updated);
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        title: 'Test Expense',
        category: 'Food', // При создании передаем строку
        price: 10.99,
        location: 'Supermarket', // При создании передаем строку
        datetime: new Date('2023-01-01T12:00:00Z'),
      };

      const result = await controller.create(createExpenseDto);
      
      expect(service.create).toHaveBeenCalledWith(createExpenseDto);
      expect(result).toEqual({
        id: 1,
        title: 'Test Expense',
        category: { id: 1, name: 'Food', expenses: [] },
        price: 10.99,
        location: { id: 1, name: 'Supermarket', expenses: [] },
        datetime: createExpenseDto.datetime,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of expenses', async () => {
      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockExpenses);
    });

    it('should support pagination', async () => {
      const skip = 1;
      const limit = 10;
      
      await controller.findAll(skip, limit);
      
      expect(service.findAll).toHaveBeenCalledWith(skip, limit);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const result = await controller.findOne(1);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockExpense);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        title: 'Updated Expense',
        category: 'Transport', // При обновлении передаем строку
        price: 15.99,
      };

      const result = await controller.update(1, updateExpenseDto);
      
      expect(service.update).toHaveBeenCalledWith(1, updateExpenseDto);
      expect(result).toEqual({
        ...mockExpense,
        title: 'Updated Expense',
        category: { id: 2, name: 'Transport', expenses: [] },
        price: 15.99,
      });
    });

    it('should update only provided fields', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        title: 'Updated Title Only',
      };

      const result = await controller.update(1, updateExpenseDto);
      
      expect(service.update).toHaveBeenCalledWith(1, updateExpenseDto);
      expect(result.title).toBe('Updated Title Only');
      expect(result.price).toBe(10.99); // Не изменилось
      expect(result.category.name).toBe('Food'); // Не изменилось
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      await controller.remove(1);
      
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});