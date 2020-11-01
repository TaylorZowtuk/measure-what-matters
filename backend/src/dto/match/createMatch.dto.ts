import { ApiProperty } from "@nestjs/swagger";

export class CreateMatchDTO {

    @ApiProperty()
    teamId : number;

    @ApiProperty({format: "int64"})
    time : number;

    @ApiProperty()
    isHomeTeam : boolean;

}