import { ApiProperty } from '@nestjs/swagger';

export class GoalDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty({ format: 'int64' })
  time: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty({ isArray: true, type: 'integer', example: [1, 2, 3, 4, 5, 6] })
  lineup: number[];
}
