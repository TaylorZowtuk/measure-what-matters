import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DbModule, EventModule],
})
export class AppModule {}
