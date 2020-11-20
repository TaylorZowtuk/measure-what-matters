import { Module } from '@nestjs/common';
import { GoalController } from '../event/goal/goal.controller';
import { GoalService } from 'src/event/goal/goal.service';
import { SubstitutionController } from './substitution/substitution.controller';
import { SubstitutionService } from './substitution/substitution.service';
import { PlayerService } from '../player/player.service';
import { AssistController } from './assist/assist.controller';
import { AssistService } from './assist/assist.service';
import { PossessionService } from './possession/possession.service';
import { PossessionController } from './possession/possession.controller';
import { ShotController } from './shot/shot.controller';
import { ShotService } from './shot/shot.service';

@Module({
  imports: [],
  controllers: [
    GoalController,
    SubstitutionController,
    AssistController,
    PossessionController,
    ShotController,
  ],
  providers: [
    GoalService,
    SubstitutionService,
    PlayerService,
    AssistService,
    PossessionService,
    ShotService,
  ],
})
export class EventModule {}
