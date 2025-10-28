import type { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    register(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
}
