import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from '../db/entities/events/goal.entity';
import { Substitution } from '../db/entities/events/substitution.entity';
import { Player } from '../db/entities/player.entity';
import { PlayerDTO } from '../dto/player/player.dto';
import { Repository } from 'typeorm';
import { PlayerTimeDTO } from 'src/dto/stats/playerTime.dto';
import { Match } from '../db/entities/match.entity';
import { Lineup } from '../db/entities/lineup.entity';
import { PlusMinusDTO } from 'src/dto/stats/plusMinus.dto';
import { Possession } from 'src/db/entities/events/possession.entity';
import { PlayerTouchesDTO } from 'src/dto/stats/playerTouches.dto';
import { ReturnTouchesDTO } from 'src/dto/stats/returnTouches.dto';
import { PlayerPossessionStatDTO } from 'src/dto/stats/possession/playerPossessionStat.dto';
import { PlayerPossessionsReturnDTO } from 'src/dto/stats/possession/playerPossessionReturn.dto';
import { TeamPossessionSummaryDTO } from 'src/dto/stats/possession/teamPossessionSummary.dto';
import { GoalDTO } from 'src/dto/events/goal.dto';
import { OnForGoalDTO } from 'src/dto/stats/onForGoal.dto';
@Injectable()
export class PlayerStatsService {
  subRepo: Repository<any>;
  goalRepo: Repository<any>;
  playerRepo: Repository<any>;
  matchRepo: Repository<any>;
  lineupRepo: Repository<any>;
  possRepo: Repository<any>;

  constructor(
    @InjectRepository(Substitution)
    subRepo: Repository<Substitution>,
    @InjectRepository(Goal)
    goalRepo: Repository<Goal>,
    @InjectRepository(Player)
    playerRepo: Repository<Player>,
    @InjectRepository(Match)
    matchRepo: Repository<Match>,
    @InjectRepository(Lineup)
    lineupRepo: Repository<Lineup>,
    @InjectRepository(Possession)
    possRepo: Repository<Possession>,
  ) {
    this.subRepo = subRepo;
    this.goalRepo = goalRepo;
    this.playerRepo = playerRepo;
    this.matchRepo = matchRepo;
    this.lineupRepo = lineupRepo;
    this.possRepo = possRepo;
  }

  /**
   * Retrieves milliseconds played by a player for a given match.
   *
   * @param playerId - The player we want to see time played
   * @param matchId - The match for which we want to see time played
   *
   * @returns the time played in that match in milliseconds
   */
  /**
   * Retrieves milliseconds played by a player for a given match.
   *
   * @param playerId - The player we want to see time played
   * @param matchId - The match for which we want to see time played
   *
   * @returns the time played in that match in milliseconds
   */

  async getMillisecondsPlayed(
    playerId: number,
    matchId: number,
  ): Promise<number> {
    let timeOnField = 0;
    if (matchId === null) {
      throw new BadRequestException('matchId cannot be null');
    }
    const match = await this.matchRepo.findOneOrFail({ where: { matchId } });
    const matchFinishTime = match.fullTime;

    const query1 = this.subRepo.createQueryBuilder('substitution');

    query1.andWhere('substitution.playerId = :id1', { id1: playerId });
    query1.andWhere('substitution.matchId = :id2', { id2: matchId });
    const substitutions = await query1.getMany();

    for (let i = 0; i < substitutions.length; i++) {
      const time_on = substitutions[i].timeOn;
      let time_off = substitutions[i].timeOff;

      // if time_off is null, that means they were the last sub of the game
      if (time_off == null) {
        if (!matchFinishTime) {
          throw new NotFoundException('Match does not have finish time');
        }
        time_off = matchFinishTime;
      }
      timeOnField += time_off - time_on;
    }

    return timeOnField;
  }

  async getPlayersTimes(matchId: number): Promise<PlayerTimeDTO[]> {
    const playerTimeDtos: PlayerTimeDTO[] = [];
    if (matchId === null) {
      throw new BadRequestException('matchId cannot be null');
    }
    const match = await this.matchRepo.findOne({ where: { matchId: matchId } });
    const teamId = match.teamId.teamId;

    const lineup: Lineup = await this.lineupRepo.findOneOrFail({
      where: { matchId },
    });
    const players: Player[] = [];

    for (let i = 0; i < lineup.lineup.length; i++) {
      players.push(
        await this.playerRepo.findOne({
          where: { playerId: lineup.lineup[i] },
        }),
      );
    }

    for (let i = 0; i < players.length; i++) {
      const playerId = players[i].playerId;
      const firstName = players[i].firstName;
      const lastName = players[i].lastName;
      const jerseyNum = players[i].jerseyNum;
      const millisecondsPlayed = await this.getMillisecondsPlayed(
        players[i].playerId,
        matchId,
      );
      const player_time_DTO: PlayerTimeDTO = {
        playerId,
        teamId,
        firstName,
        lastName,
        jerseyNum,
        millisecondsPlayed,
      };

      playerTimeDtos.push(player_time_DTO);
    }

    return playerTimeDtos;
  }

  /**
   * Retrieves an array of players on the field at the time of a goal.
   *
   * @param goalId - The id for the goal scored
   *
   * @returns the DTO array of players on the field during the time of the goal
   */

  async getPlayersOnForGoal(goal: GoalDTO) {
    const players: Player[] = [];

    for (let i = 0; i < goal.lineup.length; i++) {
      const player: Player = await this.playerRepo.findOne({
        where: { playerId: goal.lineup[i] },
      });
      players.push(player);
    }

    return this.convertToPlayersDtos(players);
  }

  /**
   * Retrieves an array of players on the field at the time of a goal.
   *
   * @param goalId - The id for the goal scored
   *
   * @returns the DTO array of players on the field during the time of the goal
   */

  async onForGoal(matchId: number) {
    const onForGoalsMatch: OnForGoalDTO[] = [];

    const goals: Goal[] = await this.goalRepo.find({ where: { matchId } });
    const goalDtos: GoalDTO[] = this.convertToDto(goals);

    for (let i = 0; i < goalDtos.length; i++) {
      const players: PlayerDTO[] = await this.getPlayersOnForGoal(goalDtos[i]);
      const onForGoal: OnForGoalDTO = {
        players,
        goal: goalDtos[i],
      };
      onForGoalsMatch.push(onForGoal);
    }

    return onForGoalsMatch;
  }

  /**
   * Retrieves plus minus of all players on for a match
   *
   * @param matchId - The id for the match
   *
   * @returns the DTO array of players and their plus minus for a given match
   */
  async plusMinus(matchId: number): Promise<PlusMinusDTO[]> {
    const lineup: Lineup = await this.lineupRepo.findOneOrFail({
      where: { matchId },
    });
    const players: Player[] = [];

    for (let i = 0; i < lineup.lineup.length; i++) {
      players.push(
        await this.playerRepo.findOne({
          where: { playerId: lineup.lineup[i] },
        }),
      );
    }
    const playerDtos: PlayerDTO[] = this.convertToPlayersDtos(players);

    const goals: Goal[] = await this.goalRepo.find({ where: { matchId } });

    const plusMinusArray: PlusMinusDTO[] = [];

    for (let i = 0; i < playerDtos.length; i++) {
      let plusMinus = 0;
      for (let j = 0; j < goals.length; j++) {
        if (goals[j].lineup.includes(playerDtos[i].playerId)) {
          if (goals[j].playerId === null) {
            plusMinus--;
          } else {
            plusMinus++;
          }
        }
      }
      plusMinusArray.push({
        player: playerDtos[i],
        plusMinus: plusMinus,
      });
    }

    return plusMinusArray;
  }

  /**
   * Retrieves the touches for all players of a given match
   *
   * @param matchId - The id for the match
   *
   * @returns the DTO array of players and their touches for a given match
   */
  async touchesPlayersForMatch(matchId: number) {
    const lineup: Lineup = await this.lineupRepo.findOneOrFail({
      where: { matchId },
    });
    const players: Player[] = [];

    const match: Match = await this.matchRepo.findOneOrFail({
      where: { matchId },
    });
    // need halfTime to do by half
    const halfTime = match.halfTime;

    for (let i = 0; i < lineup.lineup.length; i++) {
      players.push(
        await this.playerRepo.findOne({
          where: { playerId: lineup.lineup[i] },
        }),
      );
    }
    const playerDtos: PlayerDTO[] = this.convertToPlayersDtos(players);

    const possessions: Possession[] = await this.possRepo.find({
      where: { matchId },
    });

    const firstHalfTouches = this.touchesCalculation(
      1,
      halfTime,
      playerDtos,
      possessions,
    );
    const secondHalfTouches = this.touchesCalculation(
      2,
      halfTime,
      playerDtos,
      possessions,
    );
    const fullGameTouches = this.touchesCalculation(
      3,
      halfTime,
      playerDtos,
      possessions,
    );

    const gameTouches: ReturnTouchesDTO = {
      firstHalfTouches,
      secondHalfTouches,
      fullGameTouches,
    };

    return gameTouches;
  }

  /**
   *  Returns the calculation of touches per player for either first half, second half, or whole game
   *
   */
  // half is either 1 for first half, 2 for second half or 3 for full game match touches
  private touchesCalculation(
    half: number,
    halfTime: number,
    playerDtos: PlayerDTO[],
    possessions: Possession[],
  ) {
    const possessionsFiltered = this.filterPossessions(
      half,
      halfTime,
      possessions,
    );
    const touchesMatch: PlayerTouchesDTO[] = [];
    let oppTouches = 0;
    for (let i = 0; i < playerDtos.length; i++) {
      let touches = 0;
      for (let j = 0; j < possessionsFiltered.length; j++) {
        if (possessionsFiltered[j].playerId === playerDtos[i].playerId) {
          touches++;
        }
      }
      touchesMatch.push({
        player: playerDtos[i],
        touches: touches,
      });
    }
    for (let i = 0; i < possessionsFiltered.length; i++) {
      if (possessionsFiltered[i].playerId === null) {
        oppTouches++;
      }
    }

    touchesMatch.push({
      player: null,
      touches: oppTouches,
    });
    return touchesMatch;
  }

  /**
   * Filters possession objects for either first half, second half or whole game
   */

  private filterPossessions(
    half: number,
    halfTime: number,
    possessions: Possession[],
  ): Possession[] {
    if (half === 1) {
      possessions = possessions.filter(
        possession => possession.time < halfTime,
      );
    } else if (half == 2) {
      possessions = possessions.filter(
        possession => possession.time >= halfTime,
      );
    }
    return possessions;
  }

  /**
   * Calculation for all of first half, second half or whole game player possessions
   *
   * @param matchId: matchId we want the possessions for
   *
   * @returns 3 parameters, one carrying possessions for first half, one for second and one for whole game
   */
  async playerPossessionsStat(matchId: number) {
    const lineup: Lineup = await this.lineupRepo.findOneOrFail({
      where: { matchId },
    });
    const players: Player[] = [];

    const match: Match = await this.matchRepo.findOneOrFail({
      where: { matchId },
    });
    // need halfTime to do by half
    const halfTime = match.halfTime;
    const fullTime = match.fullTime;

    for (let i = 0; i < lineup.lineup.length; i++) {
      players.push(
        await this.playerRepo.findOne({
          where: { playerId: lineup.lineup[i] },
        }),
      );
    }
    const playerDtos: PlayerDTO[] = this.convertToPlayersDtos(players);

    const possessions: Possession[] = await this.possRepo.find({
      where: { matchId },
    });
    possessions.sort(function(a, b) {
      return a.time - b.time;
    });
    const possessionsFilt = possessions.filter(
      possession => possession.neutral === false,
    );

    const firstHalfPossessionsPlayer: PlayerPossessionStatDTO[] = this.playersPossessionsCalculate(
      1,
      halfTime,
      fullTime,
      possessionsFilt,
      playerDtos,
    );

    const secondHalfPossessionsPlayer: PlayerPossessionStatDTO[] = this.playersPossessionsCalculate(
      2,
      halfTime,
      fullTime,
      possessionsFilt,
      playerDtos,
    );
    const fullGamePossessionsPlayer: PlayerPossessionStatDTO[] = this.playersPossessionsCalculate(
      3,
      halfTime,
      fullTime,
      possessionsFilt,
      playerDtos,
    );

    const playerPossessionsReturnObject: PlayerPossessionsReturnDTO = {
      firstHalfPossessionsPlayer,
      secondHalfPossessionsPlayer,
      fullGamePossessionsPlayer,
    };

    return playerPossessionsReturnObject;
  }

  /**
   * Calculates the possessions of each player for a half, or full game
   *
   *
   * @returns An array of objects carrying players and their possession for a half or the full game
   */
  // first half = 1, second half = 2, whole game = 3
  private playersPossessionsCalculate(
    half: number,
    halfTime: number,
    fullTime: number,
    possessions: Possession[],
    playerDtos: PlayerDTO[],
  ) {
    const playerPossessionsStatDTOs: PlayerPossessionStatDTO[] = [];
    const possessionsFilt = this.filterPossessions(half, halfTime, possessions);

    for (let i = 0; i < playerDtos.length; i++) {
      let possession = 0;
      for (let j = 0; j < possessionsFilt.length; j++) {
        if (possessionsFilt[j].playerId === playerDtos[i].playerId) {
          if (j < possessionsFilt.length - 1) {
            possession += possessionsFilt[j + 1].time - possessionsFilt[j].time;
          }
          // if its the last possession, need to use match full time or halftime if first half
          else {
            if (half === 1) {
              possession += halfTime - possessionsFilt[j].time;
            } else {
              possession += fullTime - possessionsFilt[j].time;
            }
          }
        }
      }
      playerPossessionsStatDTOs.push({
        player: playerDtos[i],
        possession,
      });
    }
    let oppPossession = 0;

    for (let j = 0; j < possessionsFilt.length; j++) {
      if (possessionsFilt[j].playerId === null && !possessionsFilt[j].neutral) {
        if (j < possessionsFilt.length - 1) {
          oppPossession +=
            possessionsFilt[j + 1].time - possessionsFilt[j].time;
        }
        // if its the last possession, need to use match full time
        else {
          if (half === 1) {
            oppPossession += halfTime - possessionsFilt[j].time;
          } else {
            oppPossession += fullTime - possessionsFilt[j].time;
          }
        }
      }
    }
    playerPossessionsStatDTOs.push({
      player: null,
      possession: oppPossession,
    });

    return playerPossessionsStatDTOs;
  }

  /** Calculates the possession splits for first half, second half, and whole game
   *
   * @param matchId the match we are seeking the summary for
   *
   * @returns an object containing our teams percent possession for first half, second half and full match
   *
   */

  async teamPossessionSummaryForMatch(matchId: number) {
    const playerPossessions: PlayerPossessionsReturnDTO = await this.playerPossessionsStat(
      matchId,
    );

    const firstHalfPossOurTeam = this.teamPossessionCalculation(
      playerPossessions.firstHalfPossessionsPlayer,
    );
    const secondHalfPossOurTeam = this.teamPossessionCalculation(
      playerPossessions.secondHalfPossessionsPlayer,
    );
    const fullGamePossOurTeam = this.teamPossessionCalculation(
      playerPossessions.fullGamePossessionsPlayer,
    );

    const teamPossessionSummary: TeamPossessionSummaryDTO = {
      firstHalfPossOurTeam,
      secondHalfPossOurTeam,
      fullGamePossOurTeam,
    };

    return teamPossessionSummary;
  }

  /**
   *
   * calculates the possession splits for a given half, or full game
   *
   */

  private teamPossessionCalculation(
    playerPossessions: PlayerPossessionStatDTO[],
  ): number {
    let ourPossession = 0;
    let oppPossession = 0;

    for (let i = 0; i < playerPossessions.length; i++) {
      if (playerPossessions[i].player) {
        ourPossession += playerPossessions[i].possession;
      }
      // null player, means other team, will be one value for this in a playerPossessions object
      else {
        oppPossession += playerPossessions[i].possession;
      }
    }

    const totalPossession = ourPossession + oppPossession;

    return (100 * ourPossession) / totalPossession;
  }

  /**
   * Converts a list of player entities to a list of player dtos
   *
   * @param players - The list of player entities we want to convert to a list of player DTOs
   *
   * @returns A list of player dtos converted from an entity
   */

  private convertToPlayersDtos(players: any[]) {
    const playerDtos: PlayerDTO[] = [];
    players.forEach(element => {
      const playerDto: PlayerDTO = {
        playerId: element.playerId,
        teamId: element.teamId.teamId,
        firstName: element.firstName,
        lastName: element.lastName,
        jerseyNum: element.jerseyNum,
      };
      playerDtos.push(playerDto);
    });
    return playerDtos;
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
