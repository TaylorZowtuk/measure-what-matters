import { ApiProperty } from '@nestjs/swagger';

export class MatchDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  teamId: number;

  @ApiProperty({
    format: 'int',
    description: 'The epoch time that that the game started.',
  })
  startTime: number;

  @ApiProperty()
  isHomeTeam: boolean;

  @ApiProperty()
  halfTime: number;

  @ApiProperty()
  fullTime: number;
}
