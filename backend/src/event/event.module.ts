import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalController } from '../event/goal/goal.controller';
import { Goal } from 'src/db/entities/events/goal.entity';
import { GoalService } from 'src/event/goal/goal.service';
import { SubstitutionController } from './substitution/substitution.controller';
import { SubstitutionService } from './substitution/substitution.service';
import { Substitution } from '../db/entities/events/substitution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Substitution])],
  controllers: [GoalController, SubstitutionController],
  providers: [GoalService, SubstitutionService],
  exports: [GoalService, SubstitutionService],
})
export class EventModule {}
