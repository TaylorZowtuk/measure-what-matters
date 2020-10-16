import { Controller, Get, Param } from "@nestjs/common";
import { PlayerStatsService } from "./playerStats.service";

@Controller('player_stats')
export class PlayerStatsController {

    playerStatsService: PlayerStatsService;

    constructor(playerStatsService: PlayerStatsService) {
      this.playerStatsService = playerStatsService;
    }
  

    @Get('timeOnField/:playerId/:matchId/')
    getTimeOnField(@Param() params){
        
        const playerId: number = +params.playerId;
        const matchId: number = +params.matchId;

        return this.playerStatsService.getSecondsPlayed(playerId,matchId);
    }



}
