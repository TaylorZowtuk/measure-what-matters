import { ApiProperty } from "@nestjs/swagger";

export class TeamDTO {

    @ApiProperty({required: false, description: 'Not required for creation'})
    teamId?: number;

    @ApiProperty()
    name : string;

    @ApiProperty()
    userId: number;
    
}