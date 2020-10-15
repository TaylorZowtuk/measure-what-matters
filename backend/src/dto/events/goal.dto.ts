import { ApiProperty } from "@nestjs/swagger";

export class GoalDTO {
    
    @ApiProperty()
    matchId: number;

    @ApiProperty()
    time: number;

    @ApiProperty()
    playerId: number;

}

