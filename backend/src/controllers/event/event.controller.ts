import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GoalDTO } from 'src/dto/events/goal.dto';
import { GoalService } from 'src/services/goal/goal.service';

@Controller('events')
export class EventController {
    goalService: GoalService;

    constructor(eventService: GoalService) {
        this.goalService = eventService;
    }

    @Post('goals')
    @ApiResponse({status: 201, description: "Creates a new goal event"})
    async saveGoalEvent(@Body() goal: GoalDTO) {
        return await this.goalService.saveGoal(goal)
    }

    @Get('goals/playerId')
    @ApiResponse({status: 200, type: GoalDTO, isArray: true, description: "Returns array of goals for the specified player"})
    async getGoalByPlayer(@Query("playerId") playerId: number) {
        return this.goalService.getGoalsByPlayerId(playerId);
    }

    @Get('goals/matchId')
    @ApiResponse({status: 200, type: GoalDTO, isArray: true, description: "Returns array of goals for the specified match"})
    async getGoalByMatch(@Query("matchId") matchId: number) {
        return await this.goalService.getGoalsByMatchId(matchId);
    }
}
