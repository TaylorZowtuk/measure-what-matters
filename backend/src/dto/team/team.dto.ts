import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TeamDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
