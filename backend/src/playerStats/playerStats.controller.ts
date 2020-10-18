import { Controller, Get, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PlayerTimeDTO } from "src/dto/stats/playerTime.dto";
import { PlayerDTO } from "../dto/player/player.dto";
import { PlayerStatsService } from "./playerStats.service";

@ApiTags('Player Stats')
@Controller('player-stats')
export class PlayerStatsController {

    playerStatsService: PlayerStatsService;

    constructor(playerStatsService: PlayerStatsService) {
      this.playerStatsService = playerStatsService;
    }

    @Get('timeOnField')
    @ApiResponse({
        status: 200,
        type: PlayerTimeDTO,
        isArray: true,
        description: 'Returns an array of time on field for all players in a specific match',
      })
    async getTimeOnField(@Query('matchId') matchId:number ): Promise<PlayerTimeDTO[]>{
        return await this.playerStatsService.getPlayersTimes(matchId);
    }

    @ApiResponse({
      status: 201,
      type: PlayerDTO,
      isArray: true,
      description: 'Creates the starting lineup substitutions'
    })
    @Get('onForGoal')
    async getPlayersOnForGoal(@Query('goalId') goalId:number): Promise<PlayerDTO[]>{
        return await this.playerStatsService.getPlayersOnForGoal(goalId);
    }
}