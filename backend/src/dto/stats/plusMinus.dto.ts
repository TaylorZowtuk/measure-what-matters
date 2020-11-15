import { ApiProperty } from '@nestjs/swagger';
import { PlayerDTO } from '../player/player.dto';

export class PlusMinusDTO {
  @ApiProperty()
  player: PlayerDTO;

  @ApiProperty()
  plusMinus: number;
}
