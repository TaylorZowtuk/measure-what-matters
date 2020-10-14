import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from 'src/db/entities/events/goal.entity';
import { GoalDTO } from 'src/dto/events/goal.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GoalService {
    goalRepo: Repository<any>;

    constructor(@InjectRepository(Goal)
    goalRepo: Repository<Goal>) {
        this.goalRepo = goalRepo;
    }

    async saveGoal(goal: GoalDTO): Promise<void> {
        await this.goalRepo.save(goal);
    }
}
