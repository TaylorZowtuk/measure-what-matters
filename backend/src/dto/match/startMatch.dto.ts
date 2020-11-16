import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StartMatchDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty({
    description: 'The epoch timestamp the game recording session began.',
  })
  @IsNotEmpty()
  time: number;
}
