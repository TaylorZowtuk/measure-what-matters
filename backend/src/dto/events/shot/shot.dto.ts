import { ApiProperty } from '@nestjs/swagger';

export class ShotDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  matchId: number;

  @ApiProperty()
  time: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty()
  onTarget: boolean;
}
