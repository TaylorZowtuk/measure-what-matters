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
   * Retrieves seconds played by a player for a given match.
   *
   * @param playerId - The player we want to see time played
   * @param matchId - The match for which we want to see time played
   *
   * @returns the time played in that match in seconds
   */

  async getSecondsPlayed(playerId: number, matchId: number): Promise<number> {
    let timeOnField = 0;
    const match = await this.matchRepo.findOne({ where: { matchId } });
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
      const secondsPlayed = await this.getSecondsPlayed(
        players[i].playerId,
        matchId,
      );
      const player_time_DTO: PlayerTimeDTO = {
        playerId,
        teamId,
        firstName,
        lastName,
        jerseyNum,
        secondsPlayed,
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

  async getPlayersOnForGoal(goalId: number) {
    const players: Player[] = [];

    const query1 = this.goalRepo.createQueryBuilder('goal');

    query1.andWhere('goal.id = :id1', { id1: goalId });

    const goal = await query1.getOne();

    for (let i = 0; i < goal.lineup.length; i++) {
      const player: Player = await this.playerRepo.findOne({
        where: { playerId: goal.lineup[i] },
      });
      players.push(player);
    }

    return this.convertToPlayersDtos(players);
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
}
