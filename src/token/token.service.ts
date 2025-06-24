import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs'
import { CreateTokenDto } from './dto/token.dto';
import { Prisma } from 'generated/prisma';
import { Token } from './entities/token.entity';
@Injectable()
export class TokenService {
    constructor(private prisma: PrismaClient,
        private jwtService: JwtService) { }

    // Create a new token
    async createToken(createTokenDto: CreateTokenDto,
        prisma: Prisma.TransactionClient
    ): Promise<Token> {
        const token = await this.prisma.token.create({
            data: {
                ...createTokenDto
            },
        });
        return token;
    }
    // Generate a JWT token
    JWTSign(
        payload: { email: string, token_id: number },
        expiry?: string

    ) {
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: expiry
        });
        return token;
    }

    async createAccessToken(
        userId: number,
        prisma: Prisma.TransactionClient
    ) {
        const tokenData = await this.createToken(
            {
                user_id: userId,
                token_data: this.JWTSign({ email: userId.toString(), token_id: userId }),
                expiry_date: dayjs().add(1, 'hour').toDate()
            },
            prisma
        );
        return tokenData;
    }
    // Validate a token
    async validateToken({ token_id, email }: { token_id: number, email: string }) {
        const token = await this.prisma.token.findUnique({
            where: {
                id: token_id,
                expiry_date: dayjs().add(1, 'hour').toDate(),
                User: { email: email }
            },
        });
        if (!token?.user_id) {
            return false;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: token.user_id },
        });
        if (!user) {
            return false;
        }
        return user;

    }
    async generateToken(
        userId: number,
        prisma: Prisma.TransactionClient,
        email: string
    ): Promise<Token> {
        const tokenData = await this.createAccessToken(userId, prisma);
        const payload = {
            email: email,
            token_id: tokenData.id
        };
        const token = this.JWTSign(payload, '1h');
        // Save the token in the database
        await this.prisma.token.update({
            where: { id: tokenData.id },
            data: { token_data: token },
        });
        // Return the token
        tokenData.token_data = token;
        return tokenData;
    }

}




