import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalController } from '../event/goal/goal.controller';
import { Goal } from 'src/db/entities/events/goal.entity';
import { GoalService } from 'src/event/goal/goal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalController],
  providers: [GoalService],
  exports: [GoalService],
})
export class EventModule {}
