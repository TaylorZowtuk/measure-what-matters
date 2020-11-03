import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateLineupDTO {

    @ApiProperty({ isArray: true, type: 'integer'})
    @IsNotEmpty()
    lineup: number;

    @ApiProperty()
    @IsNotEmpty()
    matchId: number;

}
