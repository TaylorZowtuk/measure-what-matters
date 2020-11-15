import { ApiProperty } from '@nestjs/swagger';
import { PlayerTouchesDTO } from './playerTouches.dto';

export class ReturnTouchesDTO {
  @ApiProperty()
  firstHalfTouches: PlayerTouchesDTO[];

  @ApiProperty()
  secondHalfTouches: PlayerTouchesDTO[];

  @ApiProperty()
  fullGameTouches: PlayerTouchesDTO[];
}
