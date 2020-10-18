import { Body, Controller, Post, Get, Query} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Player } from '../db/entities/player.entity';
import { PlayerDTO } from '../dto/player/player.dto';
import { PlayerService } from './player.service';

@ApiTags('Players')
@Controller('player')
export class PlayerController {

    playerService : PlayerService;

    constructor(playerService: PlayerService) {
        this.playerService = playerService;
    }
    
    @Post()
    @ApiResponse({ status: 201, description: 'Creates a new player' })
    async createPlayer(@Body() player: PlayerDTO){
        return await this.playerService.savePlayer(player);
    }

    @Get('/teamId')
    @ApiResponse({
        status: 200,
        type: Player,
        isArray: true,
        description: 'Returns array of players for the given team Id',
      })
    async getPlayersbyTeamId(@Query('teamId') teamId: number ) : Promise<PlayerDTO[]>{  
        return await this.playerService.getPlayers(teamId);
    }
}