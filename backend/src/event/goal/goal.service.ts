import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from '../../db/entities/events/goal.entity';
import { GoalDTO } from '../../dto/events/goal.dto';
import { Repository } from 'typeorm';
import { PlayerService } from '../../player/player.service';
import { InvalidLineupError } from '../../exceptions/lineup.exception';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal) private readonly goalRepo: Repository<Goal>,
    private readonly playerService: PlayerService,
  ) {}

  /**
   * Saves a goal event to the DB.
   *
   * @param goal - The goal we want to save to the DB
   */
  async saveGoal(goal: GoalDTO) {
    const playersInLineupEntities = await this.playerService.getPlayers(
      goal.lineup,
    );
    if (playersInLineupEntities.includes(undefined)) {
      throw new InvalidLineupError(goal.lineup);
    }
    await this.goalRepo.save(goal);
  }

  /**
   * Retrieves a list of goals scored by the player.
   *
   * @param playerId - The players id which we want to list goals for
   *
   * @returns A list of goal dtos in a resolved promise
   */
  async getGoalsByPlayerId(playerId: number): Promise<GoalDTO[]> {
    const goals: Goal[] = await this.goalRepo.find({
      where: { player: { playerId: playerId } },
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
    const goals: Goal[] = await this.goalRepo.find({
      where: { match: { matchId: matchId } },
    });
    return this.convertToDto(goals);
  }

  /**
   *
   * @param playerId - The id of the player which we want goals for
   * @param matchId - The id of the match we want goals for
   */
  async getGoalsForPlayerInMatch(playerId: number, matchId: number) {
    const goals: Goal[] = await this.goalRepo.find({
      where: {
        match: { matchId: matchId },
        player: { playerId: playerId },
      },
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
  private convertToDto(goals: Goal[]) {
    const goalDtos: GoalDTO[] = [];
    goals.forEach(goal => {
      const lineup: number[] = [];
      goal.lineup.forEach(playerId => {
        lineup.push(playerId);
      });
      const goalDto: GoalDTO = {
        matchId: goal.matchId,
        playerId: goal.playerId,
        time: goal.time,
        lineup: lineup,
      };
      goalDtos.push(goalDto);
    });
    return goalDtos;
  }
}
