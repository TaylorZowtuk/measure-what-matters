import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../../db/entities/team.entity';

export class MatchDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  team: Team;

  @ApiProperty()
  teamId: number;

  @ApiProperty({
    format: 'int',
    description: 'The epoch time that the game is scheduled to begin.',
  })
  scheduledTime: number;

  @ApiProperty({
    format: 'int',
    description: 'The epoch time that the recording session began.',
  })
  startTime: number;

  @ApiProperty({
    format: 'int',
    description: 'The game time that halftime occurred.',
  })
  halfTime: number;

  @ApiProperty({
    format: 'int',
    description: 'The game time in milliseconds that the game concluded.',
  })
  fullTime: number;

  @ApiProperty()
  opponentTeamName: string;

  @ApiProperty()
  isHomeTeam: boolean;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty()
  updatedDate: Date;
}
