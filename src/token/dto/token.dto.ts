// create token dto
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTokenDto {
     @IsString()
    @IsOptional()
    token_data?: string;

    @IsNotEmpty()
    user_id: number;
    expiry_date: Date;
}

