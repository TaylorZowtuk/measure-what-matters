import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from '../../db/entities/events/goal.entity';
import { GoalDTO } from '../../dto/events/goal.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GoalService {
  goalRepo: Repository<any>;

  constructor(
    @InjectRepository(Goal)
    goalRepo: Repository<Goal>,
  ) {
    this.goalRepo = goalRepo;
  }

  /**
   * Saves a goal event to the DB.
   *
   * @param goal - The goal we want to save to the DB
   */
  async saveGoal(goal: GoalDTO): Promise<void> {
    return this.goalRepo.save(goal);
  }

  /**
   * Retrieves a list of goals scored by the player.
   *
   * @param playerId - The players id which we want to list goals for
   *
   * @returns A list of goal dtos in a resolved promise
   */
  async getGoalsByPlayerId(playerId: number): Promise<GoalDTO[]> {
    var goals: any[] = await this.goalRepo.find({
      where: { playerId: playerId },
    });
    return this.convertToDto(goals);
  }

  /**
   * Retrieves a list of goals scored in a match.
   *
   * @param matchId - The match id which we want to list goals for
   *
   * @returns A list of goal dtos in a resolved promise
   */
  async getGoalsByMatchId(matchId: number): Promise<GoalDTO[]> {
    var goals: any[] = await this.goalRepo.find({
      where: { matchId: matchId },
    });
    return this.convertToDto(goals);
  }

  /**
   * Converts a list of goal entities to a list of goal dtos
   *
   * @param goals - The list of goal entities we want to convert to a list of goal DTOs
   *
   * @returns A list of goal dtos converted from an entity
   */
  private convertToDto(goals: any[]) {
    var goalDtos: GoalDTO[] = [];
    goals.forEach(element => {
      const goalDto: GoalDTO = {
        matchId: element.matchId.matchId,
        playerId: element.playerId.playerId,
        time: element.time,
      };
      goalDtos.push(goalDto);
    });
    return goalDtos;
  }
}
