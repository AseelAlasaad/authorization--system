// create token dto
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTokenDto {
    @IsNotEmpty()
    @IsString()
    token_data: string;

    @IsNotEmpty()
    user_id: number;
    @IsOptional()
    expiry_date?: Date;
}

