import { ApiProperty } from '@nestjs/swagger';

export class LineupDTO {
  @ApiProperty()
  lineupId: number;

  @ApiProperty({ isArray: true, type: 'integer' })
  lineup: number[];

  @ApiProperty()
  matchId: number;
}
