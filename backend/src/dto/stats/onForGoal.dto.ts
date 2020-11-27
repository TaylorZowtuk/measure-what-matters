import { ApiProperty } from '@nestjs/swagger';
import { GoalDTO } from '../events/goal.dto';
import { PlayerDTO } from '../player/player.dto';

export class OnForGoalDTO {
  @ApiProperty()
  players: PlayerDTO[];

  @ApiProperty()
  goal: GoalDTO;
}
