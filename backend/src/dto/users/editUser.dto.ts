import { ApiProperty } from '@nestjs/swagger';

export class EditUserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  teamId: number;
}
