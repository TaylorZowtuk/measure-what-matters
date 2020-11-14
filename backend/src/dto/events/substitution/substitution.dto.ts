import { ApiProperty } from '@nestjs/swagger';

export class SubstitutionDTO {
  id?: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty()
  matchId: number;

  @ApiProperty({
    format: 'int',
    description: 'The time the player came onto the field in seconds',
  })
  timeOn: number;

  timeOff?: number;
}
