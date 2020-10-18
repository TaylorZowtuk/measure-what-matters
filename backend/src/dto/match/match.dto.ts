import { ApiProperty } from "@nestjs/swagger";

export class MatchDTO {

    @ApiProperty({required: false, description: "Not required for creation"})
    matchId?: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty({format: "int64"})
    time : number;

    @ApiProperty()
    isHomeTeam : boolean;

}