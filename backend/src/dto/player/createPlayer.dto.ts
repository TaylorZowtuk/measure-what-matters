import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePlayerDTO {

    @ApiProperty()
    @IsNotEmpty()
    teamId : number;

    @ApiProperty()
    @IsNotEmpty()
    firstName : string;

    @ApiProperty()
    @IsNotEmpty()
    lastName : string;

    @ApiProperty()
    @IsNotEmpty()
    jerseyNum : number;

}