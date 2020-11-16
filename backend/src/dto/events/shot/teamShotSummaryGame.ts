import { ApiProperty } from '@nestjs/swagger';

export class TeamsShotSummaryGameDTO {
  @ApiProperty()
  matchId: number;

  @ApiProperty()
  ourShots: number;

  @ApiProperty()
  ourShotsOnTarget: number;

  @ApiProperty()
  oppShots: number;

  @ApiProperty()
  oppShotsOnTarget: number;
}
