import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpensesModule } from '../src/expenses/expenses.module';
import { CategoriesModule } from '../src/categories/categories.module';
import { LocationsModule } from '../src/locations/locations.module';
import { Expense } from '../src/expenses/entities/expense.entity';
import { Category } from '../src/categories/entities/category.entity';
import { Location } from '../src/locations/entities/location.entity';

describe('ExpensesController (e2e)', () => {
  let app: INestApplication;
  let expenseRepository: Repository<Expense>;
  let categoryRepository: Repository<Category>;
  let locationRepository: Repository<Location>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ExpensesModule,
        CategoriesModule,
        LocationsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Expense, Category, Location],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    expenseRepository = moduleFixture.get('ExpenseRepository');
    categoryRepository = moduleFixture.get('CategoryRepository');
    locationRepository = moduleFixture.get('LocationRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await expenseRepository.clear();
    await categoryRepository.clear();
    await locationRepository.clear();
  });

  describe('/expenses (GET)', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/expenses')
        .expect(200)
        .expect([]);
    });

    it('should return all expenses with category and location', async () => {
      // Сначала создаем категорию и место
      const category = await categoryRepository.save({ name: 'Food' });
      const location = await locationRepository.save({ name: 'Supermarket' });
      
      // Затем создаем расход
      const expense = await expenseRepository.save({
        title: 'Test Expense',
        category,
        price: 10.99,
        location,
        datetime: new Date('2023-01-01T12:00:00Z'),
      });

      return request(app.getHttpServer())
        .get('/expenses')
        .expect(200)
        .expect([{
          id: expense.id,
          title: 'Test Expense',
          category: { id: category.id, name: 'Food' },
          price: 10.99,
          location: { id: location.id, name: 'Supermarket' },
          datetime: expense.datetime.toISOString(),
        }]);
    });
  });

  describe('/expenses (POST)', () => {
    it('should create a new expense with existing category and location', async () => {
      // Сначала создаем категорию и место
      await categoryRepository.save({ name: 'Food' });
      await locationRepository.save({ name: 'Supermarket' });

      const createExpenseDto = {
        title: 'Test Expense',
        category: 'Food',
        price: 10.99,
        location: 'Supermarket',
        datetime: '2023-01-01T12:00:00.000Z',
      };

      return request(app.getHttpServer())
        .post('/expenses')
        .send(createExpenseDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: expect.any(Number),
            title: 'Test Expense',
            category: { id: expect.any(Number), name: 'Food' },
            price: 10.99,
            location: { id: expect.any(Number), name: 'Supermarket' },
            datetime: '2023-01-01T12:00:00.000Z',
          });
        });
    });

    it('should create a new expense with new category and location', async () => {
      const createExpenseDto = {
        title: 'Test Expense',
        category: 'Transport',
        price: 5.5,
        location: 'Bus',
        datetime: '2023-01-01T12:00:00.000Z',
      };

      return request(app.getHttpServer())
        .post('/expenses')
        .send(createExpenseDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: expect.any(Number),
            title: 'Test Expense',
            category: { id: expect.any(Number), name: 'Transport' },
            price: 5.5,
            location: { id: expect.any(Number), name: 'Bus' },
            datetime: '2023-01-01T12:00:00.000Z',
          });
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidExpenseDto = {
        title: 'Test Expense',
        // missing required fields
      };

      return request(app.getHttpServer())
        .post('/expenses')
        .send(invalidExpenseDto)
        .expect(400);
    });
  });

  describe('/expenses/:id (GET)', () => {
    it('should return a specific expense with category and location', async () => {
      // Сначала создаем категорию и место
      const category = await categoryRepository.save({ name: 'Food' });
      const location = await locationRepository.save({ name: 'Supermarket' });
      
      // Затем создаем расход
      const expense = await expenseRepository.save({
        title: 'Test Expense',
        category,
        price: 10.99,
        location,
        datetime: new Date('2023-01-01T12:00:00Z'),
      });

      return request(app.getHttpServer())
        .get(`/expenses/${expense.id}`)
        .expect(200)
        .expect({
          id: expense.id,
          title: 'Test Expense',
          category: { id: category.id, name: 'Food' },
          price: 10.99,
          location: { id: location.id, name: 'Supermarket' },
          datetime: expense.datetime.toISOString(),
        });
    });

    it('should return 404 for non-existent expense', () => {
      return request(app.getHttpServer())
        .get('/expenses/999')
        .expect(404);
    });
  });

  describe('/expenses/:id (PUT)', () => {
    it('should update an expense', async () => {
      // Сначала создаем категорию и место
      const category = await categoryRepository.save({ name: 'Food' });
      const location = await locationRepository.save({ name: 'Supermarket' });
      
      // Затем создаем расход
      const expense = await expenseRepository.save({
        title: 'Test Expense',
        category,
        price: 10.99,
        location,
        datetime: new Date('2023-01-01T12:00:00Z'),
      });

      const updateExpenseDto = {
        title: 'Updated Expense',
        price: 15.99,
      };

      return request(app.getHttpServer())
        .put(`/expenses/${expense.id}`)
        .send(updateExpenseDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Expense');
          expect(res.body.price).toBe(15.99);
        });
    });

    it('should update an expense with new category and location', async () => {
      // Сначала создаем категорию и место
      const category = await categoryRepository.save({ name: 'Food' });
      const location = await locationRepository.save({ name: 'Supermarket' });
      
      // Затем создаем расход
      const expense = await expenseRepository.save({
        title: 'Test Expense',
        category,
        price: 10.99,
        location,
        datetime: new Date('2023-01-01T12:00:00Z'),
      });

      const updateExpenseDto = {
        category: 'Transport',
        location: 'Bus',
      };

      return request(app.getHttpServer())
        .put(`/expenses/${expense.id}`)
        .send(updateExpenseDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.category.name).toBe('Transport');
          expect(res.body.location.name).toBe('Bus');
        });
    });
  });

  describe('/expenses/:id (DELETE)', () => {
    it('should delete an expense', async () => {
      // Сначала создаем категорию и место
      const category = await categoryRepository.save({ name: 'Food' });
      const location = await locationRepository.save({ name: 'Supermarket' });
      
      // Затем создаем расход
      const expense = await expenseRepository.save({
        title: 'Test Expense',
        category,
        price: 10.99,
        location,
        datetime: new Date('2023-01-01T12:00:00Z'),
      });

      return request(app.getHttpServer())
        .delete(`/expenses/${expense.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent expense', () => {
      return request(app.getHttpServer())
        .delete('/expenses/999')
        .expect(404);
    });
  });

  describe('/categories (GET)', () => {
    it('should return all categories', async () => {
      await categoryRepository.save({ name: 'Food' });
      await categoryRepository.save({ name: 'Transport' });

      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('name', 'Food');
          expect(res.body[1]).toHaveProperty('name', 'Transport');
        });
    });
  });

  describe('/locations (GET)', () => {
    it('should return all locations', async () => {
      await locationRepository.save({ name: 'Supermarket' });
      await locationRepository.save({ name: 'Bus' });

      return request(app.getHttpServer())
        .get('/locations')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('name', 'Supermarket');
          expect(res.body[1]).toHaveProperty('name', 'Bus');
        });
    });
  });
});