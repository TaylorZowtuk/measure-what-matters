import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../db/entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  // Create a match (scheduled)
  async createMatch(
    teamId: number,
    scheduledTime: number,
    opponentTeamName: string,
    isHomeTeam: boolean,
  ): Promise<Match> {
    const match = this.matchRepo.create({
      teamId,
      scheduledTime,
      opponentTeamName,
      isHomeTeam,
    });
    return this.matchRepo.save(match);
  }

  // Start a match recording session
  async startMatch(matchId: number, startTime: number): Promise<Match> {
    if (!matchId) throw new Error('matchId cannot be null');
    const match: Match = await this.matchRepo.findOneOrFail({ matchId });
    match.startTime = startTime;
    return this.matchRepo.save(match);
  }

  async getMatches(teamId: number): Promise<Match[]> {
    const matches: Match[] = await this.matchRepo.find({ where: { teamId } });
    Logger.log(matches);

    // return this.convertToDto(matches);
    return matches;
  }

  // Add the time that the halftime began
  async addHalfTime(matchId: number, time: number): Promise<Match> {
    if (!matchId) throw new Error('matchId cannot be null');
    const match = await this.matchRepo.findOneOrFail({ matchId });
    if (time < 0) {
      throw new BadRequestException('Halftime cannot be a negative value');
    }
    const matchUpdate = { ...match, halfTime: time };
    return this.matchRepo.save(matchUpdate);
  }

  // Add the time that the game concluded
  async addFullTime(matchId: number, time: number): Promise<Match> {
    const match = await this.matchRepo.findOneOrFail({ matchId });
    if (time < match.halfTime) {
      throw new BadRequestException('Fulltime cannot be smaller than halftime');
    }
    if (time < 0) {
      throw new BadRequestException('Fulltime cannot be a negative value');
    }
    const matchUpdate = { ...match, fullTime: time };
    return this.matchRepo.save(matchUpdate);
  }
}
