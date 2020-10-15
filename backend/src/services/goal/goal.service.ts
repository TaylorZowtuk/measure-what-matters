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
        return this.goalRepo.save(goal);
    }

    async getGoalsByPlayerId(playerId: number): Promise<GoalDTO[]> {
        var goals:any[] = await this.goalRepo.find({where: {playerId: playerId}})
        return this.convertToDto(goals);
    }

    async getGoalsByMatchId(matchId: number): Promise<GoalDTO[]> {
        var goals:any[] = await this.goalRepo.find({where: {matchId: matchId}})
        return this.convertToDto(goals);
    }

    private convertToDto(goals:any[]) {
        var goalDtos: GoalDTO[] = [];
        goals.forEach(element => {
            const goalDto: GoalDTO = {
                matchId: element.matchId.matchId,
                playerId: element.playerId.playerId,
                time: element.time,
            }
            goalDtos.push(goalDto);
        });
        return goalDtos;
    }
}
