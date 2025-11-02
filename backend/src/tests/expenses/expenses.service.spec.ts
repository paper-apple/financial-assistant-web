// expenses.service.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";
import type { Repository } from "typeorm";
import { CategoriesService } from "../../categories/categories.service";
import { Expense } from "../../expenses/entities/expense.entity";
import { ExpensesService } from "../../expenses/expenses.service";
import { LocationsService } from "../../locations/locations.service";

describe("ExpensesService", () => {
  let service: ExpensesService;
  let repo: Partial<Record<keyof Repository<Expense>, any>>;
  let categoriesService: Partial<CategoriesService>;
  let locationsService: Partial<LocationsService>;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
      createQueryBuilder: vi.fn(),
    };

    categoriesService = {
      findOrCreate: vi.fn(),
    };

    locationsService = {
      findOrCreate: vi.fn(),
    };

    service = new ExpensesService(
      repo as Repository<Expense>,
      categoriesService as CategoriesService,
      locationsService as LocationsService
    );
  });

  it("create вызывает category/location сервисы и сохраняет расход", async () => {
    const dto = { title: "Хлеб", price: 100, datetime: new Date(), category: "еда", location: "магазин" };
    const userId = 1;

    (categoriesService.findOrCreate as any).mockResolvedValue({ id: 10, name: "еда" });
    (locationsService.findOrCreate as any).mockResolvedValue({ id: 20, name: "магазин" });
    (repo.create as any).mockReturnValue({ ...dto, id: 123 });
    (repo.save as any).mockResolvedValue({ ...dto, id: 123 });

    const result = await service.create(dto as any, userId);

    expect(categoriesService.findOrCreate).toHaveBeenCalledWith("еда");
    expect(locationsService.findOrCreate).toHaveBeenCalledWith("магазин");
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ title: "Хлеб", user: { id: 1 } }));
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe(123);
  });

  it("findOne возвращает расход, если найден", async () => {
    const expense = { id: 1, user: { id: 2 } };
    (repo.findOne as any).mockResolvedValue(expense);

    const result = await service.findOne(1, 2);

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1, user: { id: 2 } },
      relations: ["user", "category", "location"],
    });
    expect(result).toBe(expense);
  });

  it("findOne выбрасывает NotFoundException, если не найден", async () => {
    (repo.findOne as any).mockResolvedValue(null);

    await expect(service.findOne(1, 2)).rejects.toThrow(NotFoundException);
  });

  it("update обновляет поля и сохраняет", async () => {
    const expense = { id: 1, title: "старое", user: { id: 2 } };
    (service as any).findOne = vi.fn().mockResolvedValue(expense);
    (repo.save as any).mockResolvedValue({ ...expense, title: "новое" });

    const dto = { title: "новое" };
    const result = await service.update(1, dto as any, 2);

    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ title: "новое" }));
    expect(result.title).toBe("новое");
  });

  it("remove вызывает findOne и удаляет", async () => {
    const expense = { id: 1, user: { id: 2 } };
    (service as any).findOne = vi.fn().mockResolvedValue(expense);
    (repo.remove as any).mockResolvedValue(undefined);

    await service.remove(1, 2);

    expect(repo.remove).toHaveBeenCalledWith(expense);
  });

  it("suggestKeywords возвращает [] если query слишком короткий", async () => {
    const result = await service.suggestKeywords("a", 1);
    expect(result).toEqual([]);
  });

  it("suggestKeywords вызывает queryBuilder и возвращает значения", async () => {
    const qbMock = {
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      getRawMany: vi.fn().mockResolvedValue([{ value: "еда" }, { value: "магазин" }]),
    };
    (repo.createQueryBuilder as any).mockReturnValue(qbMock);

    const result = await service.suggestKeywords("ма", 1, "title");

    expect(repo.createQueryBuilder).toHaveBeenCalledWith("expense");
    expect(result).toEqual(["еда", "магазин"]);
  });
});