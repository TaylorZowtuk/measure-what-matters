import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAssistDTO {

    @ApiProperty()
    @IsNotEmpty()
    matchId: number;

    @ApiProperty()
    @IsNotEmpty()
    time: number;

    @ApiProperty()
    @IsNotEmpty()
    playerId: number;

}