import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
    @ApiResponse({ status: 201, description: 'Creates a new player' })
    createPlayer(@Body() player: PlayerDTO){
        this.playerService.savePlayer(player);
    }

    @Get('/:id')
    @ApiResponse({
        status: 200,
        type: Player,
        isArray: true,
        description: 'Returns array of players for the given team Id',
      })
    getPlayersbyTeamId(@Param('id') id: number ) : Promise<Player[]>{  
        return this.playerService.getPlayers(id);
    }
}