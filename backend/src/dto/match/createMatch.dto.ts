import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMatchDTO {
  @ApiProperty()
  @IsNotEmpty()
  teamId: number;

  @ApiProperty({
    format: 'bigint',
    description: 'The epoch time that that the game started.',
  })
  @IsNotEmpty()
  startTime: number;

  @ApiProperty()
  @IsNotEmpty()
  isHomeTeam: boolean;
}
