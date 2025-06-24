import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService,PrismaModule } from 'nestjs-prisma';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [PrismaModule],
  providers: [AuthService, PrismaService, TokenService, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}