// categories.service.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Repository } from "typeorm";
import { CategoriesService } from "../../categories/categories.service";
import { Category } from "../../categories/entities/category.entity";

describe("CategoriesService", () => {
  let service: CategoriesService;
  let categoriesRepository: Partial<Repository<Category>>;

  beforeEach(() => {
    categoriesRepository = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    service = new CategoriesService(categoriesRepository as Repository<Category>);
  });

  it("возврат существующей категорию", async () => {
    const existing: Category = { id: 1, name: "Еда", expenses: [] };
    (categoriesRepository.findOne as any).mockResolvedValue(existing);

    const result = await service.findOrCreate("Еда");

    expect(result).toEqual(existing);
    expect(categoriesRepository.findOne).toHaveBeenCalledWith({ where: { name: "Еда" } });
    expect(categoriesRepository.create).not.toHaveBeenCalled();
    expect(categoriesRepository.save).not.toHaveBeenCalled();
  });

  it("создание и сохранение категории", async () => {
    (categoriesRepository.findOne as any).mockResolvedValue(null);

    const created: Partial<Category> = { name: "Транспорт", expenses: [] };
    const saved: Category = { id: 2, name: "Транспорт", expenses: [] };

    (categoriesRepository.create as any).mockReturnValue(created);
    (categoriesRepository.save as any).mockResolvedValue(saved);

    const result = await service.findOrCreate("Транспорт");

    expect(categoriesRepository.findOne).toHaveBeenCalledWith({ where: { name: "Транспорт" } });
    expect(categoriesRepository.create).toHaveBeenCalledWith({ name: "Транспорт" });
    expect(categoriesRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });
});