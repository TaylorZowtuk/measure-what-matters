import { ApiProperty } from '@nestjs/swagger';
import { PlayerDTO } from 'src/dto/player/player.dto';

export class PlayerPossessionStatDTO {
  @ApiProperty()
  player: PlayerDTO;

  @ApiProperty()
  possession: number;
}
