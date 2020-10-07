import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ConfigModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
