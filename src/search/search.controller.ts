import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
@Controller('search')
export class SearchController {
    @UseGuards(JwtAuthGuard)
    @Get()
    search() {
        return 'This action returns all search results';
    }
}
