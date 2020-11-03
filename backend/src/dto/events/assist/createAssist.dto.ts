import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAssistDTO {

    @ApiProperty()
    @IsNotEmpty()
    matchId: number;

    @ApiProperty({format: "int64"})
    @IsNotEmpty()
    time: number;

    @ApiProperty()
    @IsNotEmpty()
    playerId: number;

}