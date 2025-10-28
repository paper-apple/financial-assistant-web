import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(username: string): Promise<User | null>;
    create(username: string, password: string): Promise<User>;
    validateUser(username: string, password: string): Promise<User | null>;
}
