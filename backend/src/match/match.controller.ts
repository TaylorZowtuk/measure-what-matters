import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Match } from '../db/entities/match.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchService } from './match.service';
import { QueryFailedError } from 'typeorm';
import { CreateMatchDTO } from '../dto/match/createMatch.dto';
import { HalfTimeDTO } from '../dto/match/halfTime.dto';
import { FullTimeDTO } from '../dto/match/fullTime.dto';
import { MatchDTO } from 'src/dto/match/match.dto';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('start')
  @ApiResponse({ status: 201, description: 'Creates a new match' })
  @ApiResponse({
    status: 400,
    description: 'Violates foreign key, or null value entered',
  })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  @UsePipes(ValidationPipe)
  async startMatch(@Body() match: CreateMatchDTO) {
    try {
      if (!match.teamId) {
        throw new BadRequestException('TeamId cannot be null');
      }
      return await this.matchService.saveMatch(match);
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
  @ApiResponse({ status: 400, description: 'Invalid integer entered' })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  async getMatchesByTeamId(@Query('teamId', ParseIntPipe) teamId: number) {
    try {
      return await this.matchService.getMatches(teamId);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException('Please enter a valid integer');
        }
      } else {
        throw new InternalServerErrorException('Unknown problem occured');
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
    description: 'Both fields should  be integers',
  })
  @ApiResponse({
    status: 404,
    description: 'MatchId requested for is not in database',
  })
  async updateHalfTimeMatch(@Body() matchHalfTime: HalfTimeDTO) {
    try {
      return await this.matchService.addHalfTime(matchHalfTime);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new NotFoundException('Match does not exist in database');
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
        throw new InternalServerErrorException('Unknown error occured');
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
    description: 'Both fields should  be integers',
  })
  @ApiResponse({
    status: 400,
    description: 'Fulltime cannot be smaller than halftime',
  })
  @ApiResponse({
    status: 404,
    description: 'MatchId requested for is not in database',
  })
  async updateFullTimeMatch(@Body() matchFullTime: FullTimeDTO) {
    try {
      return await this.matchService.addFullTime(matchFullTime);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new NotFoundException('Match does not exist in database');
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
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
