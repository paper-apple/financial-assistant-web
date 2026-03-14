// expenses.controller.spec.ts
import { ExpensesController } from "../../expenses/expenses.controller";
import { ExpensesService } from "../../expenses/expenses.service";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

describe("ExpensesController", () => {
  let controller: ExpensesController;
  let service: jest.Mocked<ExpensesService>;
  const createMockUser = (overrides = {}) => ({
      id: 1,
      username: 'test',
      password: '1234Ab',
      expenses: [],
      ...overrides
    });  

  beforeEach(() => {
    service = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      suggestKeywords: vi.fn(),
    } as any;

    controller = new ExpensesController(service);
  });

  it("вызов service.create с dto и userId", () => {
    const dto = { title: "Хлеб", price: 100 };
    const mockUser = createMockUser();

    (service as any).create.mockReturnValue("created");

    const result = controller.create(dto as any, mockUser);

    expect(service.create).toHaveBeenCalledWith(dto, 1);
    expect(result).toBe("created");
  });

  it("передача фильтров и сортировки в service.findAll", () => {
    const mockUser = createMockUser({
      id: 7
    });

    (service as any).findAll.mockReturnValue("rows");

    const result = controller.findAll(
      mockUser,
      "10" as any,
      "200" as any,
      "2024-01-01" as any,
      "2024-12-31" as any,
      "price",
      "DESC",
      ["еда", "магазин"]
    );

    expect(service.findAll).toHaveBeenCalledWith(
      7,
      {
        minPrice: 10,
        maxPrice: 200,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        keywords: ["еда", "магазин"],
      },
      { field: "price", direction: "DESC" }
    );
    expect(result).toBe("rows");
  });

  it("вызов service.findOne с id и userId", () => {
    const mockUser = createMockUser({
      id: 1
    });
    (service as any).findOne.mockReturnValue("one");

    const result = controller.findOne(5 as any, mockUser);

    expect(service.findOne).toHaveBeenCalledWith(5, 1);
    expect(result).toBe("one");
  });

  it("вызов service.update с id, dto и userId", () => {
    const mockUser = createMockUser({
      id: 2
    });
    const dto = { title: "новое" };
    (service as any).update.mockReturnValue("updated");

    const result = controller.update(10 as any, dto as any, mockUser);

    expect(service.update).toHaveBeenCalledWith(10, dto, 2);
    expect(result).toBe("updated");
  });

  it("вызов service.remove с id и userId", () => {
    const mockUser = createMockUser({
      id: 3
    });
    (service as any).remove.mockReturnValue("removed");

    const result = controller.remove(99 as any, mockUser);

    expect(service.remove).toHaveBeenCalledWith(99, 3);
    expect(result).toBe("removed");
  });

  it("вызов service.suggestKeywords с query, userId и field", () => {
    const mockUser = createMockUser({
      id: 4
    });
    (service as any).suggestKeywords.mockReturnValue(["еда"]);

    const result = controller.suggestKeywords(mockUser, "ма", "title");

    expect(service.suggestKeywords).toHaveBeenCalledWith("ма", 4, "title");
    expect(result).toEqual(["еда"]);
  });
});