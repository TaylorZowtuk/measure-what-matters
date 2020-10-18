import { ApiProperty } from "@nestjs/swagger";

export class SubstitutionDTO {

    @ApiProperty({required: false, description: 'Only required for subbing out'})
    id?: number;

    @ApiProperty()
    playerId: number;

    @ApiProperty()
    matchId: number;

    @ApiProperty({
        format: 'int64', 
        description: 'The time the player came onto the field'
    })
    timeOn: number;

    @ApiProperty({
        format: 'int64', 
        required: false,
        description: 'The time the player left the field. Only required for new subs'
    })
    timeOff?: number;
}