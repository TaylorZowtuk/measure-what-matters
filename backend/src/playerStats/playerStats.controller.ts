import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerTimeDTO } from '../dto/stats/playerTime.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerStatsService } from './playerStats.service';
import { PlayerDTO } from '../dto/player/player.dto';
import { QueryFailedError } from 'typeorm';

@ApiTags('Player Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get('timeOnField')
  @ApiResponse({
    status: 200,
    type: PlayerTimeDTO,
    isArray: true,
    description:
      'Returns an array of time on field for all players in a specific match',
  })
  @ApiResponse({ status: 400, description: 'MatchId not in database' })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  async getTimeOnField(@Query('matchId', ParseIntPipe) matchId: number) {
    try {
      matchId = +matchId;
      return await this.playerStatsService.getPlayersTimes(matchId);
    } catch (error) {
      if (error instanceof TypeError) {
        if (error.message.includes('Cannot read property')) {
          throw new BadRequestException('matchId does not exist in database');
        }
      }
      return new InternalServerErrorException('Unknown error occured');
    }
  }

  @ApiResponse({
    status: 201,
    type: PlayerDTO,
    isArray: true,
    description: 'Creates the starting lineup substitutions',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid integer entered for goalId or matchId does not exist',
  })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  @Get('onForGoal')
  async getPlayersOnForGoal(@Query('goalId', ParseIntPipe) goalId: number) {
    try {
      goalId = +goalId;
      return await this.playerStatsService.getPlayersOnForGoal(goalId);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          return new BadRequestException(
            'Please enter a valid integer for goalId',
          );
        }
      } else if (error instanceof TypeError) {
        if (error.message.includes('Cannot read property')) {
          throw new BadRequestException('matchId does not exist in database');
        }
      } else {
        return new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
