import { ApiProperty } from '@nestjs/swagger';

export class SubstitutionDTO {
  id?: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty()
  matchId: number;

  @ApiProperty({
    format: 'int64',
    description: 'The time the player came onto the field',
  })
  timeOn: number;

  timeOff?: number;
}
