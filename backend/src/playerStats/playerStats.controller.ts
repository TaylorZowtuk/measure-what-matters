import { BadRequestException, Controller, Get, InternalServerErrorException, Query, UseGuards } from '@nestjs/common';
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
  async getTimeOnField(
    @Query('matchId') matchId: number,
  ) {
    try{
      matchId = +matchId;
      if(typeof matchId !== "number"){return new BadRequestException("Enter a valid matchId");}
      return await this.playerStatsService.getPlayersTimes(matchId);
    }
    catch(error){
      if(error instanceof TypeError){
        if(error.message.includes("Cannot read property")){
          throw new BadRequestException("matchId does not exist in database");
        }
      }
      return new InternalServerErrorException("Unknown error occured");
      
    }
  
  }

  @ApiResponse({
    status: 201,
    type: PlayerDTO,
    isArray: true,
    description: 'Creates the starting lineup substitutions',
  })
  @Get('onForGoal')
  async getPlayersOnForGoal(
    @Query('goalId') goalId: number,
  ){
    try{
      goalId = +goalId;
      return await this.playerStatsService.getPlayersOnForGoal(goalId);
    }
    catch(error){
      if(error instanceof QueryFailedError){
        if(error.message.includes("invalid input syntax for type integer")){
          return new BadRequestException("Please enter a valid integer for goalId");
        }
      }
      else if(error instanceof TypeError){
        if(error.message.includes("Cannot read property")){
          throw new BadRequestException("matchId does not exists in database");
        }
      } else{
        return new InternalServerErrorException("Unknown error occured");
      }
    }
  }
}
