import { ApiProperty } from '@nestjs/swagger';
import { PlayerDTO } from '../player/player.dto';

export class PlayerTouchesDTO {
  @ApiProperty()
  player: PlayerDTO;

  @ApiProperty()
  touches: number;
}
