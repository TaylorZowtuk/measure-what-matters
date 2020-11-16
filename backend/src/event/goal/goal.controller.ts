import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GoalDTO } from '../../dto/events/goal.dto';
import { GoalService } from '../../event/goal/goal.service';
import { InvalidLineupError } from '../../exceptions/lineup.exception';

@ApiTags('Goals')
@Controller('event/goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GoalController {
  goalService: GoalService;

  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Creates a new goal event',
  })
  @ApiResponse({
    status: 400,
    description: 'The request body contains an invalid field',
  })
  @ApiResponse({
    status: 500,
    description: 'Something went wrong',
  })
  async saveGoalEvent(@Body() goal: GoalDTO) {
    try {
      await this.goalService.saveGoal(goal);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.message.includes('violates foreign key constraint')) {
          throw new BadRequestException(
            'The request body contains invalid playerId or matchId',
          );
        } else if (err.message.includes('violates not-null constraint')) {
          throw new BadRequestException(
            'The request body contains a missing or null field',
          );
        }
      } else if (err instanceof InvalidLineupError) {
        throw new BadRequestException(err.message);
      } else {
        throw new InternalServerErrorException(
          'Something went wrong. Please try again later.',
        );
      }
    }
  }

  @Get('')
  @ApiResponse({
    status: 200,
    type: GoalDTO,
    isArray: true,
    description: 'Returns array of goals for the specified player',
  })
  @ApiResponse({
    status: 400,
    description: 'The request has a missing or invalid query param',
  })
  @ApiQuery({
    name: 'playerId',
    required: false,
  })
  @ApiQuery({
    name: 'matchId',
    required: false,
  })
  async getGoals(
    @Query('playerId') playerId: number = null,
    @Query('matchId') matchId: number = null,
  ) {
    if (playerId && matchId) {
      return await this.goalService.getGoalsForPlayerInMatch(playerId, matchId);
    }
    if (playerId) {
      return await this.goalService.getGoalsByPlayerId(playerId);
    } else if (matchId) {
      return await this.goalService.getGoalsByMatchId(matchId);
    } else {
      throw new BadRequestException('Must provide at least one query param');
    }
  }
}
