import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoalDTO } from 'src/dto/events/goal.dto';
import { GoalService } from 'src/event/goal/goal.service';

@ApiTags('Goals')
@Controller('event/goals')
export class GoalController {
  goalService: GoalService;

  constructor(eventService: GoalService) {
    this.goalService = eventService;
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Creates a new goal event' })
  async saveGoalEvent(@Body() goal: GoalDTO) {
    return await this.goalService.saveGoal(goal);
  }

  @Get('playerId')
  @ApiResponse({
    status: 200,
    type: GoalDTO,
    isArray: true,
    description: 'Returns array of goals for the specified player',
  })
  async getGoalByPlayer(@Query('playerId') playerId: number) {
    return this.goalService.getGoalsByPlayerId(playerId);
  }

  @Get('matchId')
  @ApiResponse({
    status: 200,
    type: GoalDTO,
    isArray: true,
    description: 'Returns array of goals for the specified match',
  })
  async getGoalByMatch(@Query('matchId') matchId: number) {
    return await this.goalService.getGoalsByMatchId(matchId);
  }
}
