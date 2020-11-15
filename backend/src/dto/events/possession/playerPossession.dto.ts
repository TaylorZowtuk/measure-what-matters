import { ApiProperty } from '@nestjs/swagger';

export class PlayerPossessionDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  playerId: number;
}
