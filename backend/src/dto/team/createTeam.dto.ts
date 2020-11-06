import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDTO {
  @ApiProperty()
  name: string;

  userId?: number;
}
