import { ApiProperty } from "@nestjs/swagger";

export class SubstitutionExchangeDTO {

    @ApiProperty()
    playerIdIn: number;

    @ApiProperty()
    playerIdOut: number;

    @ApiProperty()
    matchId: number;

    @ApiProperty()
    time: number;
}