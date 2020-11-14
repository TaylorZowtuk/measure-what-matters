import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../db/entities/match.entity';
import { MatchDTO } from '../dto/match/match.dto';
import { HalfTimeDTO } from '../dto/match/halfTime.dto';
import { FullTimeDTO } from '../dto/match/fullTime.dto';
import { Repository } from 'typeorm';
import { CreateMatchDTO } from '../dto/match/createMatch.dto';

@Injectable()
export class MatchService {
  matchRepo: Repository<any>;

  constructor(
    @InjectRepository(Match)
    matchRepo: Repository<Match>,
  ) {
    this.matchRepo = matchRepo;
  }

  /**
   * Saves a newly created match to the DB.
   *
   * @param match - The beginning of a new match session to be saved to database
   */

  async saveMatch(match: CreateMatchDTO): Promise<Match> {
    return this.matchRepo.save(match);
  }

  /**
   * Retrieves a list of matches played by a team.
   *
   * @param teamId the id of the team we want to return matches for
   *
   * @returns A promise of a list of matches
   */

  async getMatches(teamId: number): Promise<MatchDTO[]> {
    const matches: Match[] = await this.matchRepo.find({ where: { teamId } });

    return this.convertToDto(matches);
  }

  /**
   * Sets the timer time that halftime occured
   *
   * @param matchHalfTime DTO containing matchId and halfTime on timer
   *
   * @returns A promise of the match DTO of the newly updated match
   */

  async addHalfTime(matchHalfTime: HalfTimeDTO): Promise<MatchDTO> {
    const match = await this.matchRepo.findOneOrFail({
      where: { matchId: matchHalfTime.matchId },
    });
    if (matchHalfTime.halfTime < 0) {
      throw new BadRequestException('Halftime cannot be a negative value');
    }
    const matchUpdate = { ...match, halfTime: matchHalfTime.halfTime };
    return this.matchRepo.save(matchUpdate);
  }

  /**
   * Sets the timer time that fulltime occured
   *
   * @param matchHalfTime DTO containing matchId and fullTime on timer
   *
   * @returns A promise of the match DTO of the newly updated match
   */

  async addFullTime(matchFullTime: FullTimeDTO): Promise<MatchDTO> {
    const match = await this.matchRepo.findOneOrFail({
      where: { matchId: matchFullTime.matchId },
    });
    if (matchFullTime.fullTime < match.halfTime) {
      throw new BadRequestException('Fulltime cannot be smaller than halftime');
    }
    if (matchFullTime.fullTime < 0) {
      throw new BadRequestException('Fulltime cannot be a negative value');
    }
    const matchUpdate = { ...match, fullTime: matchFullTime.fullTime };
    return this.matchRepo.save(matchUpdate);
  }

  /**
   * Converts a list of match entities to a list of match dtos
   *
   * @param matches - The list of match entities we want to convert to a list of match DTOs
   *
   * @returns A list of match dtos converted from an entity
   */

  private convertToDto(matches: any[]) {
    const matchDtos: MatchDTO[] = [];
    matches.forEach(element => {
      const matchDto: MatchDTO = {
        matchId: element.matchId,
        teamId: element.teamId.teamId,
        startTime: element.startTime,
        isHomeTeam: element.isHomeTeam,
        halfTime: element.halfTime,
        fullTime: element.fullTime,
      };
      matchDtos.push(matchDto);
    });
    return matchDtos;
  }
}
