import { ApiProperty } from "@nestjs/swagger";

export class LineupDTO {

    lineupId?: number;

    @ApiProperty()
    matchId: number;

    @ApiProperty({isArray: true, type: "integer"})
    lineup: number[];

}