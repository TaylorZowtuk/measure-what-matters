import { ApiProperty } from '@nestjs/swagger';

export class SubstitutionExchangeDTO {
  @ApiProperty({ description: 'The player coming onto the field' })
  playerIdIn: number;

  @ApiProperty({ description: 'The player leaving the field' })
  playerIdOut: number;

  @ApiProperty()
  matchId: number;

  @ApiProperty({
    format: 'int64',
    description: 'The time that the player was subbed out',
  })
  time: number;
}
