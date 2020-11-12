import { ApiProperty } from '@nestjs/swagger';

export class RemovePossessionDTO {
  @ApiProperty()
  possessionEventId: number;
}
