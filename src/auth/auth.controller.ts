import { Controller, Post, Body, HttpException} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: { username: string; email: string; password: string }) {
        try {
            return this.authService.register(body.username, body.email, body.password);
        } catch (error) {
            throw new HttpException({
                status: 400,
                error: error.message || 'Registration failed',
            }, 400);
        }
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        try {
            return this.authService.login(body.email, body.password);
        } catch (error) {
            throw new HttpException({
                status: 401,
                error: error.message || 'Login failed',
            }, 401);
        }
    }
}
