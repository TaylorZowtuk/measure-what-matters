import { ApiProperty } from '@nestjs/swagger';

export class NeutralPossessionDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  time: number;
}
