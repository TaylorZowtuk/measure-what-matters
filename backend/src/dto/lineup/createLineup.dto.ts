import { ApiProperty } from "@nestjs/swagger";

export class CreateLineupDTO {

    @ApiProperty({ isArray: true, type: 'integer'})
    lineup: number;

    @ApiProperty()
    matchId: number;

}
