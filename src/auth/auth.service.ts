import { Injectable, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcryptjs';
import { TokenService } from 'src/token/token.service';
@Injectable()
export class AuthService {
    constructor(private  prisma: PrismaService, private tokenService: TokenService) {}

    // register a new user
    async register(username:string,email: string, password: string) {
         try {
                    const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new HttpException({
                status: 400,
                error: 'User with this email already exists',
            }, 400);
        }

        // hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                username,
                email,
               password: hashedPassword,
            },
        });
        const tokenData = await this.tokenService.generateToken(user.id, this.prisma, user.email);
        return {
            data:{
                ...user,
                token: tokenData
            },
            message: 'User registered successfully',
        }
         } catch (error) {
            throw new HttpException({
                status: 400,
                error: error.message || 'Registration failed',
            }, 400);
         }
      
    }

    // login a user
    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Invalid credentials',
            }, HttpStatus.UNAUTHORIZED);
        }

        // compare the hashed password with the provided password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Invalid credentials',
            }, HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
    async assignRoleToUser(userId: number, roleId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User not found',
            }, HttpStatus.NOT_FOUND);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { roleId },
        });

        return {
            data: updatedUser,
            message: 'Role assigned successfully',
        };
    }
async addPermissionsToRole(roleId: number, permissions: string[]) {
    const role = await this.prisma.role.findUnique({
        where: { id: roleId },
    });

    if (!role) {
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Role not found',
        }, HttpStatus.NOT_FOUND);
    }

    const updatedRole = await this.prisma.role.update({
        where: { id: roleId },
        data: {
            permissions: {
                connectOrCreate: permissions.map(action => ({
                    where: { action }, // assumes `action` is unique in schema
                    create: { action }
                }))
            }
        }
    });

    return {
        data: updatedRole,
        message: 'Permissions added to role successfully',
    };
}

// Get the current authenticated user's information.
async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
        }, HttpStatus.NOT_FOUND);
    }

    return {
        data: user,
        message: 'User retrieved successfully',
    };
}
}