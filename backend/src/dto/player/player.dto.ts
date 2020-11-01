import { ApiProperty } from "@nestjs/swagger";

export class PlayerDTO {

    @ApiProperty()
    playerId?: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty()
    jerseyNum : number;

}