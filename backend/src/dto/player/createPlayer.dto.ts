import { ApiProperty } from "@nestjs/swagger";

export class CreatePlayerDTO {

    @ApiProperty()
    teamId : number;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty()
    jerseyNum : number;

}