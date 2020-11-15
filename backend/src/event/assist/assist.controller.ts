import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AssistDTO } from '../../dto/events/assist/assist.dto';
import { CreateAssistDTO } from '../../dto/events/assist/createAssist.dto';
import { AssistService } from './assist.service';

@ApiTags('Assists')
@Controller('event/assists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AssistController {
  constructor(private readonly assistService: AssistService) {}

  @Post('/')
  @ApiResponse({ status: 201, description: 'Creates a new assist event' })
  @ApiResponse({
    status: 400,
    description: 'Violates foreign key, or null value entered',
  })
  @ApiResponse({ status: 500, description: 'Unknown error occurred' })
  @UsePipes(ValidationPipe)
  async saveAssistEvent(@Body() assist: CreateAssistDTO) {
    try {
      return await this.assistService.saveAssist(assist);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('MatchId or PlayerId invalid');
        } else if (error.message.includes('violates not-null constraint')) {
          throw new BadRequestException('null value entered for parameter');
        }
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: AssistDTO,
    isArray: true,
    description:
      'Returns array of assists for the specified player and/or match',
  })
  @ApiResponse({ status: 400, description: 'Both playerId and matchId null' })
  @ApiResponse({ status: 500, description: 'Unknown error occurred' })
  @ApiQuery({
    name: 'playerId',
    required: false,
  })
  @ApiQuery({
    name: 'matchId',
    required: false,
  })
  async getAssistsPlayerOrMatch(
    @Query('playerId') playerId: number = null,
    @Query('matchId') matchId: number = null,
  ) {
    if (playerId && matchId) {
      return await this.assistService.getAssistByPlayerAndMatch(
        playerId,
        matchId,
      );
    } else if (playerId) {
      return await this.assistService.getAssistByPlayerId(playerId);
    } else if (matchId) {
      return await this.assistService.getAssistByMatchId(matchId);
    } else {
      throw new BadRequestException('Both playerId and matchId null');
    }
  }

  @Delete('/delete')
  @ApiResponse({
    status: 200,
    description: 'Assist event removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assist event does not exist in database',
  })
  @ApiResponse({
    status: 400,
    description: 'Not a number, number expected',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown error occured',
  })
  async deleteAssist(@Query('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return await this.assistService.removeAssistEventById(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
