import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FullTimeDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty({
    description: 'The game time in milliseconds that the game concluded.',
  })
  @IsNotEmpty()
  time: number;
}
