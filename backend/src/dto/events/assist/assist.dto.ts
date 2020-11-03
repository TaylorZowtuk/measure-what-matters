import { ApiProperty } from "@nestjs/swagger";

export class AssistDTO {
    
    @ApiProperty()
    id?: number;

    @ApiProperty()
    matchId: number;

    @ApiProperty()
    time: number;

    @ApiProperty()
    playerId: number;

}

