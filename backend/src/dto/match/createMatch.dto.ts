import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMatchDTO {

    @ApiProperty()
    @IsNotEmpty()
    teamId : number;

    @ApiProperty({format: "int64"})
    @IsNotEmpty()
    time : number;

    @ApiProperty()
    @IsNotEmpty()
    isHomeTeam : boolean;

}