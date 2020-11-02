import { ApiProperty } from "@nestjs/swagger";

export class MatchDTO {

    @ApiProperty()
    matchId: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty({format: "int64"})
    time : number;

    @ApiProperty()
    isHomeTeam : boolean;

}