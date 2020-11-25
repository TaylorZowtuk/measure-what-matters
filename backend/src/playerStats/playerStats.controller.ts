import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerTimeDTO } from '../dto/stats/playerTime.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerStatsService } from './playerStats.service';
import { PlayerDTO } from '../dto/player/player.dto';
import { QueryFailedError } from 'typeorm';
import { PlusMinusDTO } from '../dto/stats/plusMinus.dto';
import { ReturnTouchesDTO } from 'src/dto/stats/returnTouches.dto';
import { PlayerPossessionsReturnDTO } from 'src/dto/stats/possession/playerPossessionReturn.dto';
import { TeamPossessionSummaryDTO } from 'src/dto/stats/possession/teamPossessionSummary.dto';
import { OnForGoalDTO } from 'src/dto/stats/onForGoal.dto';

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
  @ApiBody({
    type: PlayerTimeDTO,
    isArray: true,
  })
  async getTimeOnField(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<PlayerTimeDTO[]> {
    try {
      return await this.playerStatsService.getPlayersTimes(matchId);
    } catch (error) {
      if (error instanceof TypeError) {
        if (error.message.includes('Cannot read property')) {
          throw new BadRequestException('matchId does not exist in database');
        }
      } else if (error.message.includes('Match does not have finish time')) {
        throw error;
      } else if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException(
          'No lineup for this match, or match does not exist',
        );
      }
      throw new InternalServerErrorException('Unknown error occured');
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
  @ApiBody({
    type: OnForGoalDTO,
    isArray: true,
  })
  @Get('/onForGoal')
  async getPlayersOnForGoals(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<OnForGoalDTO[]> {
    try {
      return await this.playerStatsService.onForGoal(matchId);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException(
            'Please enter a valid integer for goalId',
          );
        }
      } else if (error instanceof TypeError) {
        if (error.message.includes('Cannot read property')) {
          throw new BadRequestException('matchId does not exist in database');
        }
      } else if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unknown error occured');
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
  @ApiBody({
    type: PlusMinusDTO,
    isArray: true,
  })
  @Get('/plus-minus')
  async getPlusMinusMatch(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<PlusMinusDTO[]> {
    try {
      return await this.playerStatsService.plusMinus(matchId);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException('No lineup for this match');
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }
  @ApiResponse({
    status: 200,
    type: ReturnTouchesDTO,
    isArray: true,
    description:
      'Returns an array of all players and their touches for a given match',
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
  @Get('/touches')
  async getPlayerTouchesForMatch(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<ReturnTouchesDTO> {
    try {
      return await this.playerStatsService.touchesPlayersForMatch(matchId);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException('No lineup for this match');
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }

  @ApiResponse({
    status: 200,
    type: PlayerPossessionsReturnDTO,
    isArray: true,
    description:
      'Returns an array of all players and their total possession time for a match',
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
  @Get('/player-possession')
  async getPlayerPossessionsForMatch(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<PlayerPossessionsReturnDTO> {
    try {
      return await this.playerStatsService.playerPossessionsStat(matchId);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException(
          'No lineup for this match, or match does not exist',
        );
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }

  @ApiResponse({
    status: 200,
    type: TeamPossessionSummaryDTO,
    isArray: true,
    description:
      'Returns an array of all players and their total possession time for a match',
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
  @Get('/team-possession')
  async getTeamPossessionSummary(
    @Query('matchId', ParseIntPipe) matchId: number,
  ): Promise<TeamPossessionSummaryDTO> {
    try {
      return await this.playerStatsService.teamPossessionSummaryForMatch(
        matchId,
      );
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException(
          'No lineup for this match, or match does not exist',
        );
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }
}
