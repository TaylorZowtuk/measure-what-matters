import { ApiProperty } from "@nestjs/swagger";

export class PlayerDTO {

    @ApiProperty({required: false, description: "Not required for creation"})
    playerId?: number;

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    name : string;

    @ApiProperty()
    jerseyNum : number;

}