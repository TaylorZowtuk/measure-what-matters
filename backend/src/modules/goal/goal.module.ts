import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from 'src/controllers/event/event.controller';
import { Goal } from 'src/db/entities/events/goal.entity';
import { GoalService } from 'src/services/goal/goal.service';

@Module({
    imports: [TypeOrmModule.forFeature([Goal])],
    controllers: [EventController],
    providers: [GoalService],
    exports: [GoalService]
})
export class GoalModule { }