import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DbModule, EventModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
