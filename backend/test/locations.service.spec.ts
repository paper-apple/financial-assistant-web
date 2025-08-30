import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CategoriesService } from './categories.service';
// import { Category } from './entities/category.entity';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategory: Category = {
    id: 1,
    name: 'Food',
    expenses: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((category) => Promise.resolve({ id: Date.now(), ...category })),
            find: jest.fn().mockResolvedValue([mockCategory]),
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
              return Promise.resolve(id === 1 ? mockCategory : null);
            }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Transport',
      };

      const result = await service.create(createCategoryDto);
      
      expect(repository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(createCategoryDto));
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await service.findAll();
      
      expect(result).toEqual([mockCategory]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const result = await service.findOne(1);
      
      expect(result).toEqual(mockCategory);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if category not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a category by name', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockCategory);
      
      const result = await service.findByName('Food');
      
      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: 'Food' } });
      expect(result).toEqual(mockCategory);
    });

    it('should return null if category not found by name', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      
      const result = await service.findByName('NonExistent');
      
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockCategory);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...mockCategory,
        ...updateCategoryDto,
      });

      const result = await service.update(1, updateCategoryDto);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Category');
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      await service.remove(1);
      
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 0 } as any);
      
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});