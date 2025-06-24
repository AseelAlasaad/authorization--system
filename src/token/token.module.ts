import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
@Module({
  providers: [TokenService, PrismaService, JwtService],
  controllers: [TokenController]
})
export class TokenModule {}
