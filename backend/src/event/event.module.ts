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
import { AssistController } from './assist/assist.controller';
import { AssistService } from './assist/assist.service';
import { Assist } from '../db/entities/events/assist.entity';
import { PossessionService } from './possession/possession.service';
import { PossessionController } from './possession/possession.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Substitution, Player, Assist])],
  controllers: [
    GoalController,
    SubstitutionController,
    AssistController,
    PossessionController,
  ],
  providers: [
    GoalService,
    SubstitutionService,
    PlayerService,
    AssistService,
    PossessionService,
  ],
  exports: [
    GoalService,
    SubstitutionService,
    PlayerService,
    AssistService,
    PossessionService,
  ],
})
export class EventModule {}
