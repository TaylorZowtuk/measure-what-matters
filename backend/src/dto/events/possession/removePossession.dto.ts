import { ApiProperty } from '@nestjs/swagger';

export class OppositionPossessionDTO {
  @ApiProperty()
  possessionEventId: number;
}
