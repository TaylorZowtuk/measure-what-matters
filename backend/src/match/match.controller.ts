import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchService } from './match.service';
import { QueryFailedError } from 'typeorm';
import { CreateMatchDTO } from '../dto/match/createMatch.dto';
import { HalfTimeDTO } from '../dto/match/halfTime.dto';
import { FullTimeDTO } from '../dto/match/fullTime.dto';
import { MatchDTO } from '../dto/match/match.dto';
import { Match } from '../db/entities/match.entity';
import { StartMatchDTO } from '../dto/match/startMatch.dto';

@ApiTags('Matches')
@ApiResponse({ status: 500, description: 'Unknown error occurred' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @ApiResponse({ status: 201, description: 'Creates a new match' })
  @Post('/create')
  async createMatch(@Body() match: CreateMatchDTO): Promise<Match> {
    const { teamId, scheduledTime, opponentTeamName, isHomeTeam } = match;
    return await this.matchService.createMatch(
      teamId,
      scheduledTime,
      opponentTeamName,
      isHomeTeam,
    );
  }

  @Post('/start')
  @ApiResponse({ status: 201, description: 'Starts a match recording session' })
  async startMatch(@Body() data: StartMatchDTO): Promise<Match> {
    const { matchId, time } = data;
    try {
      return await this.matchService.startMatch(matchId, time);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('TeamId not in database');
        } else if (error.message.includes('violates not-null constraint')) {
          throw new BadRequestException('null value entered for parameter');
        }
      } else if (error.message.includes('violates not-null constraint')) {
        throw new BadRequestException('null value entered for parameter');
      } else {
        throw new InternalServerErrorException('Unknown error');
      }
    }
  }

  @Get('/teamId')
  @ApiResponse({
    status: 200,
    type: MatchDTO,
    isArray: true,
    description: 'Returns a list of matches for the given teamId',
  })
  async getMatchesByTeamId(
    @Query('teamId', ParseIntPipe) teamId: number,
  ): Promise<Match[]> {
    try {
      return await this.matchService.getMatches(teamId);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException('Please enter a valid integer');
        }
      } else {
        throw new InternalServerErrorException('Unknown problem occurred');
      }
    }
  }

  @Post('/halftime')
  @ApiResponse({
    status: 201,
    description: 'Adds halftime to match entity',
  })
  @ApiResponse({
    status: 400,
    description: 'MatchId or time is not valid',
  })
  async updateHalfTimeMatch(@Body() data: HalfTimeDTO) {
    const { matchId, time } = data;
    try {
      return await this.matchService.addHalfTime(matchId, time);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException('Match does not exist in database');
      } else if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException(
            'Invalid parameter entered, both fields should be integers',
          );
        }
      } else if (
        error.message.includes('Halftime cannot be a negative value')
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }

  @Post('/fullTime')
  @ApiResponse({
    status: 201,
    description: 'Adds fulltime to match entity',
  })
  @ApiResponse({
    status: 400,
    description:
      'Fulltime cannot be smaller than halftime, or MatchId is not valid',
  })
  async updateFullTimeMatch(@Body() data: FullTimeDTO) {
    const { matchId, time } = data;
    try {
      return await this.matchService.addFullTime(matchId, time);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new BadRequestException('Match does not exist in database');
      } else if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException(
            'Invalid parameter entered, both fields should be integers',
          );
        }
      } else if (
        error.message.includes('Fulltime cannot be smaller than halftime') ||
        error.message.includes('Fulltime cannot be a negative value')
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }
}
