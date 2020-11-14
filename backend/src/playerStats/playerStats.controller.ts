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
import { PlusMinusDTO } from 'src/dto/stats/plusMinus.dto';

@ApiTags('Player Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player-stats')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get('/timeOnField')
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
    status: 200,
    type: PlayerDTO,
    isArray: true,
    description: 'Returns an array of players that were on for a given goal',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid integer entered for goalId or matchId does not exist',
  })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  @Get('/onForGoal')
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
  @ApiResponse({
    status: 200,
    type: PlusMinusDTO,
    isArray: true,
    description:
      'Returns an array of all players and their plus minus for a given match',
  })
  @ApiResponse({
    status: 400,
    description: 'No lineup in database for this given match',
  })
  @ApiResponse({
    status: 400,
    description: 'Query needs to be an integer',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown error occurred',
  })
  @Get('/plus_minus')
  async getPlusMinusMatch(@Query('matchId', ParseIntPipe) matchId: number) {
    try {
      return await this.playerStatsService.PlusMinus(matchId);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException('No lineup for this match');
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }
}
