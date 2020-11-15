import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMatchDTO {
  @ApiProperty()
  @IsNotEmpty()
  teamId: number;

  @ApiProperty({
    format: 'int',
    description: 'The epoch time that that the game started.',
  })
  @IsNotEmpty()
  scheduledTime: number;

  @ApiProperty()
  opponentTeamName: string;

  @ApiProperty()
  @IsNotEmpty()
  isHomeTeam: boolean;
}
