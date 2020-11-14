import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShotDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  matchId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  time: number;

  @ApiProperty()
  playerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  onTarget: boolean;
}
