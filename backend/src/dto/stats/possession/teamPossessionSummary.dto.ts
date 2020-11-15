import { ApiProperty } from '@nestjs/swagger';

export class TeamPossessionSummaryDTO {
  @ApiProperty()
  firstHalfPossOurTeam: number;

  @ApiProperty()
  secondHalfPossOurTeam: number;

  @ApiProperty()
  fullGamePossOurTeam: number;
}
