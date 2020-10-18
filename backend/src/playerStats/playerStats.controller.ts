import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerDTO } from 'src/dto/player/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerStatsService } from './playerStats.service';

@ApiTags('Player Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player_stats')
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

  @Get('onForGoal')
  async getPlayersOnForGoal(
    @Query('goalId') goalId: number,
  ): Promise<PlayerDTO[]> {
    return await this.playerStatsService.getPlayersOnForGoal(goalId);
  }
}
