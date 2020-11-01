import { Body, Controller, Post, Get, Query, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerDTO } from '../dto/player/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerService } from './player.service';
import { QueryFailedError } from 'typeorm';
import { CreatePlayerDTO } from '../dto/player/createPlayer.dto';

@ApiTags('Players')
//@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Creates a new player' })
  async createPlayers(@Body() players: CreatePlayerDTO[]) {
    try{
      for(let i = 0; i < players.length; i++){
        if (!players[i].teamId){return new BadRequestException("At least one of the players inputted has an empty teamId");}
        else if(!players[i].firstName){return new BadRequestException("At least one of the players inputted has an empty first name");}
        else if(!players[i].lastName){return new BadRequestException("At least one of the players inputted has an empty first name");}
        else if(!players[i].jerseyNum){return new BadRequestException("At least one of the players inputted has an empty jerseyNum");}
      }
      return await this.playerService.savePlayer(players);
    }
    catch(error){
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
    type: PlayerDTO,
    isArray: true,
    description: 'Returns array of players for the given team Id',
  })
  async getPlayersByTeamId(
    @Query('teamId') teamId: number,
  ){
    if(!teamId){return new BadRequestException("No teamId entered");}
    try{
      teamId = +teamId;
      return await this.playerService.getPlayersByTeamId(teamId);
    }
    catch(error){
      if (error instanceof QueryFailedError){
        if(error.message.includes("invalid input syntax for type integer")){
          return new BadRequestException("Please enter a valid integer");
        }
      }
      else{ return new InternalServerErrorException("Unknown problem occured")}
    }
  }
}

