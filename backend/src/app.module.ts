import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './controllers/event/event.controller';
import { DbModule } from './db/db.module';
import { GoalModule } from './modules/goal/goal.module';

@Module({
  imports: [DbModule, GoalModule],
  controllers: [AppController, EventController],
  providers: [AppService],
})
export class AppModule { }
