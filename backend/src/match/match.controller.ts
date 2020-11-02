import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Match } from '../db/entities/match.entity';
import { MatchDTO } from '../dto/match/match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchService } from './match.service';
import { QueryFailedError } from 'typeorm';
import { CreateMatchDTO } from '../dto/match/createMatch.dto';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  matchService: MatchService;

  constructor(matchService: MatchService) {
    this.matchService = matchService;
  }

  @Post('start')
  @ApiResponse({ status: 201, description: 'Creates a new match' })
  async startMatch(@Body() match: CreateMatchDTO) {
    
    try{
      if (!match.teamId){
        return new BadRequestException("TeamId cannot be null");
      }
      return await this.matchService.saveMatch(match);
    }

    catch (error) {

      if (error instanceof QueryFailedError){
        if(error.message.includes("violates foreign key constraint")){
          return new BadRequestException("TeamId not in database");
        }
      }
      else if(error.message.includes("violates not-null constraint")){
        return new BadRequestException("null value entered for parameter");
      }
      else{
        return new InternalServerErrorException("Unknown error");
      }
    }
  }

  @Get('/teamId')
  @ApiResponse({
    status: 200,
    type: Match,
    isArray: true,
    description: 'Returns a list of matches for the given teamId',
  })
  async getMatchesByTeamId(
    @Query('teamId') teamId: number,
  ) {
    try{
      if(!teamId){return new BadRequestException("No teamId entered");}
      teamId = +teamId;
      return await this.matchService.getMatches(teamId);
    }
    catch(error){
      if (error instanceof QueryFailedError){
        if(error.message.includes("invalid input syntax for type integer")){
          return new BadRequestException("Please enter a valid integer");
        }
      }
      else{ return new InternalServerErrorException("Unknown problem occured");}
    }
  }
}
