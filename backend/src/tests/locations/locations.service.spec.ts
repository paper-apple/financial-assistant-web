// locations.service.spec.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Repository } from "typeorm";
import { Location } from "../../locations/entities/location.entity";
import { LocationsService } from "../../locations/locations.service";

describe("LocationsService", () => {
  let service: LocationsService;
  let locationsRepository: Partial<Repository<Location>>;

  beforeEach(() => {
    locationsRepository = {
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    service = new LocationsService(locationsRepository as Repository<Location>);
  });

  it("возврат существующей локации", async () => {
    const existing: Location = { id: 1, name: "Магазин", expenses: [] };
    (locationsRepository.findOne as any).mockResolvedValue(existing);

    const result = await service.findOrCreate("Магазин");

    expect(result).toEqual(existing);
    expect(locationsRepository.findOne).toHaveBeenCalledWith({ where: { name: "Магазин" } });
    expect(locationsRepository.create).not.toHaveBeenCalled();
    expect(locationsRepository.save).not.toHaveBeenCalled();
  });

  it("создание и сохранение локации", async () => {
    (locationsRepository.findOne as any).mockResolvedValue(null);

    const created: Partial<Location> = { name: "Банк", expenses: [] };
    const saved: Location = { id: 2, name: "Банк", expenses: [] };

    (locationsRepository.create as any).mockReturnValue(created);
    (locationsRepository.save as any).mockResolvedValue(saved);

    const result = await service.findOrCreate("Банк");

    expect(locationsRepository.findOne).toHaveBeenCalledWith({ where: { name: "Банк" } });
    expect(locationsRepository.create).toHaveBeenCalledWith({ name: "Банк" });
    expect(locationsRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });
});