import { ApiProperty } from "@nestjs/swagger";

export class AssistDTO {
    
    @ApiProperty()
    id?: number;

    @ApiProperty()
    matchId: number;

    @ApiProperty({format: "int64"})
    time: number;

    @ApiProperty()
    playerId: number;

}

