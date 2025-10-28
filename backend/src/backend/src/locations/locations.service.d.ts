import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
export declare class LocationsService {
    private locationsRepository;
    constructor(locationsRepository: Repository<Location>);
    findOrCreate(name: string): Promise<Location>;
}
