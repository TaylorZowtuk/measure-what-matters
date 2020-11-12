import {
  Controller,
  Delete,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OppositionPossessionDTO } from '../../dto/events/possession/oppositionPossession.dto';
import { PlayerPossessionDTO } from '../../dto/events/possession/playerPossession.dto';
import { PossessionService } from './possession.service';
import { RemovePossessionDTO } from '../../dto/events/possession/removePossession.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiResponse({ status: 401, description: 'User is not authenticated.' })
@ApiResponse({ status: 500, description: 'Unknown error occurred.' })
@ApiTags('Possessions')
@Controller('event/possession')
export class PossessionController {
  constructor(private readonly possessionService: PossessionService) {}

  @ApiResponse({
    status: 201,
    description: 'Creates a player possession event.',
  })
  @ApiResponse({
    status: 400,
    description:
      'MatchId or PlayerId does not exist, or a null value was used.',
  })
  @Post('/player')
  async playerPossession(@Body() possessionDetails: PlayerPossessionDTO) {
    const { matchId, time, playerId } = possessionDetails;
    try {
      return await this.possessionService.createPlayerEvent(
        matchId,
        time,
        playerId,
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('MatchId or PlayerId invalid');
        } else if (error.message.includes('violates not-null constraint')) {
          throw new BadRequestException('null value entered for parameter');
        }
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Creates a opposition possession event.',
  })
  @ApiResponse({
    status: 400,
    description: 'MatchId does not exist, or a null value was used.',
  })
  @Post('/opposition')
  async oppositionPossession(
    @Body() possessionDetails: OppositionPossessionDTO,
  ) {
    const { matchId, time } = possessionDetails;
    try {
      return await this.possessionService.createOppositionEvent(matchId, time);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('MatchId invalid');
        } else if (error.message.includes('violates not-null constraint')) {
          throw new BadRequestException('null value entered for matchId');
        }
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }

  // TODO, ask if we are computing these stats on the frontend or using an aggregator in the stats endpoint
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns an ',
  // })
  // @Get('/')
  // async getAllPossessionEvents() {
  //   // PASS
  // }

  @ApiResponse({
    status: 200,
    description: 'Possession event removed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Possession event with given Id was not found or was null',
  })
  @Delete('/')
  async removePossessionEvent(@Body() possessionDetails: RemovePossessionDTO) {
    const { possessionEventId } = possessionDetails;
    if (!possessionEventId) {
      throw new BadRequestException('possessionEventId cannot be null');
    }
    try {
      return await this.possessionService.removePossessionEventById(
        possessionEventId,
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException('Possession with given Id was not found');
      }
      throw new InternalServerErrorException('Unknown error occurred');
    }
  }
}
