import { ApiProperty } from '@nestjs/swagger';

export class OppositionPossessionDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  time: number;
}
