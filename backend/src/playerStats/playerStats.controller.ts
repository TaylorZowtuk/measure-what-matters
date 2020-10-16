import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { PlayerStatsService } from "./playerStats.service";

@Controller('player_stats')
export class PlayerStatsController {

    playerStatsService: PlayerStatsService;

    constructor(playerStatsService: PlayerStatsService) {
      this.playerStatsService = playerStatsService;
    }
  

    @Get('timeOnField/:playerId/:matchId/')
    @ApiResponse({
        status: 200,
        type: Number,
        isArray: false,
        description: 'Returns time on field for a specified player',
      })
    getTimeOnField(@Param() params){
        
        const playerId: number = +params.playerId;
        const matchId: number = +params.matchId;

        return this.playerStatsService.getSecondsPlayed(playerId,matchId);
    }



}
