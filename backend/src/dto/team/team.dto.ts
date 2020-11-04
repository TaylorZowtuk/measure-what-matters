import { ApiProperty } from '@nestjs/swagger';

export class TeamDTO {
  @ApiProperty()
  teamId: number;

  @ApiProperty()
  name: string;
}
