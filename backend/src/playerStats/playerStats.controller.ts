import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { query } from "express";
import { PlayerDTO } from "../dto/player/player.dto";
import { PlayerStatsService } from "./playerStats.service";

@ApiTags('Player Stats')
@Controller('player_stats')
export class PlayerStatsController {

    playerStatsService: PlayerStatsService;

    constructor(playerStatsService: PlayerStatsService) {
      this.playerStatsService = playerStatsService;
    }
  

    @Get('timeOnField')
    @ApiResponse({
        status: 200,
        type: Number,
        isArray: false,
        description: 'Returns time on field for a specified player',
      })
    async getTimeOnField(@Query('playerId') playerId:number, @Query('matchId') matchId:number ){
        return await this.playerStatsService.getSecondsPlayed(playerId,matchId);
    }

    @Get('onForGoal')
    async getPlayersOnForGoal(@Query('goalId') goalId:number): Promise<PlayerDTO[]>{
        return await this.playerStatsService.getPlayersOnForGoal(goalId);
    }

}
