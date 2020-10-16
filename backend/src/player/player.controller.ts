import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { Player } from 'src/db/entities/player.entity';
import { PlayerDTO } from 'src/dto/player/player.dto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {

    playerService : PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }
    
    @Post()
    createPlayer(@Body() player: PlayerDTO){
        this.playerService.savePlayer(player);
    }

    @Get('/:id')
    getPlayersbyTeamId(@Param('id') id: number ) : Promise<Player[]>{  
        return this.playerService.getPlayers(id);
    }
}