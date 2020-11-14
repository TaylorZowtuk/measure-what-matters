import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShotDTO } from '../../dto/events/shot/createShot.dto';
import { ShotService } from './shot.service';

@ApiTags('Shots')
@Controller('event/shots')
export class ShotController {
  constructor(private readonly shotService: ShotService) {}

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Creates a new shot event',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameter entered in DTO',
  })
  @UsePipes(ValidationPipe)
  async saveShotEvent(@Body() createShot: CreateShotDTO) {
    try {
      return await this.shotService.saveShot(createShot);
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException('MatchId or PlayerId invalid');
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Returns all shot events for a given match',
  })
  @ApiResponse({
    status: 400,
    description: 'MatchId has to be an integer',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown error occured',
  })
  async getShotsByMatch(@Query('matchId', ParseIntPipe) matchId: number) {
    try {
      return await this.shotService.getShotsByMatchId(matchId);
    } catch (error) {
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  @Get('/teamSummary')
  @ApiResponse({
    status: 200,
    description: 'Returns team summaries for shots',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameter entered in DTO',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown error occured',
  })
  async getTeamShotsSummaryByMatch(
    @Query('matchId', ParseIntPipe) matchId: number,
  ) {
    try {
      return await this.shotService.getTeamShotsSummaryByMatch(matchId);
    } catch (error) {
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}
