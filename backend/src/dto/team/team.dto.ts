import { ApiProperty } from '@nestjs/swagger';

export class TeamDTO {
  @ApiProperty()
  name: string;

  userId?: number;
}
