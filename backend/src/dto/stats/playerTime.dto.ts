import { ApiProperty } from "@nestjs/swagger";

export class PlayerTimeDTO {

    @ApiProperty()
    playerId: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    name : string;

    @ApiProperty()
    jerseyNum : number;

    @ApiProperty()
    secondsPlayed : number;

}