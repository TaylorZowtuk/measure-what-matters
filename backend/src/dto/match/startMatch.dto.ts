import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StartMatchDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty({
    description: 'The epoch timestamp that the game recording session began.',
  })
  @IsNotEmpty()
  time: number;
}
