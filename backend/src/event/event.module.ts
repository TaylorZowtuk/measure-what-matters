import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalController } from '../event/goal/goal.controller';
import { Goal } from 'src/db/entities/events/goal.entity';
import { GoalService } from 'src/event/goal/goal.service';
import { SubstitutionController } from './substitution/substitution.controller';
import { SubstitutionService } from './substitution/substitution.service';
import { Substitution } from '../db/entities/events/substitution.entity';
import { PlayerService } from '../player/player.service';
import { Player } from '../db/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Substitution, Player])],
  controllers: [GoalController, SubstitutionController],
  providers: [GoalService, SubstitutionService, PlayerService],
  exports: [GoalService, SubstitutionService],
})
export class EventModule {}
