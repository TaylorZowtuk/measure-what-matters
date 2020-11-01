import { ApiProperty } from "@nestjs/swagger";

export class CreateAssistDTO {

    @ApiProperty()
    matchId: number;

    @ApiProperty({format: "int64"})
    time: number;

    @ApiProperty()
    playerId: number;

}