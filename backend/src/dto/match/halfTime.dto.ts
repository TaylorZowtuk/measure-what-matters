import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class HalfTimeDTO {
  @ApiProperty()
  @IsNotEmpty()
  matchId: number;

  @ApiProperty()
  @IsNotEmpty()
  halfTime: number;
}
