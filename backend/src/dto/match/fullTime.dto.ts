import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FullTimeDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty()
  @IsNotEmpty()
  fullTime: number;
}
