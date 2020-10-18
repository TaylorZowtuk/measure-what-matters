import { ApiProperty } from "@nestjs/swagger";
import { PlayerDTO } from "./player.dto";

export class PlayerArrayDTO {

    @ApiProperty()
    playerArray : PlayerDTO[];

}