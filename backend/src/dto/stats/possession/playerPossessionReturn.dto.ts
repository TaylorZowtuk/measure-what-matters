import { ApiProperty } from '@nestjs/swagger';
import { PlayerPossessionStatDTO } from './playerPossessionStat.dto';

export class PlayerPossessionsReturnDTO {
  @ApiProperty()
  firstHalfPossessionsPlayer: PlayerPossessionStatDTO[];

  @ApiProperty()
  secondHalfPossessionsPlayer: PlayerPossessionStatDTO[];

  @ApiProperty()
  fullGamePossessionsPlayer: PlayerPossessionStatDTO[];
}
