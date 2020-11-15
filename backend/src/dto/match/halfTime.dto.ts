import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class HalfTimeDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty({
    description: 'The game time in milliseconds that halftime began',
  })
  @IsNotEmpty()
  time: number;
}
