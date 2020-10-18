import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerTimeDTO } from 'src/dto/player/playerTime.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerStatsService } from './playerStats.service';

@ApiTags('Player Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get('timeOnField')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'Returns time on field for a specified player',
  })
  async getTimeOnField(
    @Query('playerId') playerId: number,
    @Query('matchId') matchId: number,
  ) {
    return await this.playerStatsService.getSecondsPlayed(playerId, matchId);
  }

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