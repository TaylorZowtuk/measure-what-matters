import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { AssistDTO } from '../../dto/events/assist/assist.dto';
import { CreateAssistDTO } from '../../dto/events/assist/createAssist.dto';
import { AssistService } from './assist.service';


@ApiTags('Assists')
@Controller('event/assists')
export class AssistController {
  assistService: AssistService;

  constructor(assistService: AssistService) {
    this.assistService = assistService;
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Creates a new assist event' })
  async saveAssistEvent(@Body() assist: CreateAssistDTO) {
    try{
      return await this.assistService.saveAssist(assist);
    }
    catch(error){
      if(error instanceof QueryFailedError){
        if(error.message.includes("violates foreign key constraint")){
          return new BadRequestException("MatchId or PlayerId invalid");
        }
      }
      else{
        return new InternalServerErrorException("Unknown error occured");
      }
    }
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: AssistDTO,
    isArray: true,
    description: 'Returns array of assists for the specified player and/or match',
  })
  @ApiQuery({
    name: 'playerId',
    required: false,
  })
  @ApiQuery({
    name: 'matchId',
    required: false,
  })
  async getAssistsPlayerOrMatch(@Query('playerId') playerId: number = null, @Query('matchId') matchId: number = null,){
    if (playerId && matchId) {
      return await this.assistService.getAssistByPlayerAndMatch(playerId,matchId);
    } else if (playerId) {
      return await this.assistService.getAssistByPlayerId(playerId);
    } else if (matchId) {
      return await this.assistService.getAssistByMatchId(matchId);
    } else {
      throw new BadRequestException('Both playerId and matchId null');
    }
  
  }

}
