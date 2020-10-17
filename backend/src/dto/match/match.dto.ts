import { ApiProperty } from "@nestjs/swagger";

export class MatchDTO {

    @ApiProperty({required: false, description: "Not required for creation"})
    matchId?: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    time : number;

    @ApiProperty()
    isHomeTeam : boolean;

}