import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaClient) {}

    // register a new user
    async register(username:string,email: string, password: string) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                username,
                email,
               hashedPassword,
            },
        });
        // generate a JWT token

        return user;
    }

    // login a user
    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // compare the hashed password with the provided password
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return user;
    }
}
