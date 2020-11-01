import { ApiProperty } from "@nestjs/swagger";

export class PlayerDTO {

    playerId?: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    name : string;

    @ApiProperty()
    jerseyNum : number;

}