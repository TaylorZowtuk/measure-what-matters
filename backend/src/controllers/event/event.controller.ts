import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { GoalDTO } from 'src/dto/events/goal.dto';
import { GoalService } from 'src/services/goal/goal.service';

@Controller('events')
export class EventController {
    goalService: GoalService;

    constructor(eventService: GoalService) {
        this.goalService = eventService;
    }

    @Post('goals')
    saveGoalEvent(@Body() goal: GoalDTO) {
        this.goalService.saveGoal(goal)
    }
}
