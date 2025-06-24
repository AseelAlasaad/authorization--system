import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [AuthModule, TokenModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
