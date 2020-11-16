import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from '../src/match/match.service';
import { Match } from '../src/db/entities/match.entity';
import { CreateMatchDTO } from '../src/dto/match/createMatch.dto';
import { CreateUserDTO } from '../src/dto/users/createUser.dto';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';
import { MockType } from './mocks/mockType';
import { StartMatchDTO } from '../src/dto/match/startMatch.dto';
import { Team } from '../src/db/entities/team.entity';
import { User } from '../src/db/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { HalfTimeDTO } from '../src/dto/match/halfTime.dto';

describe('MatchService Test', () => {
  const matchRepoToken = getRepositoryToken(Match);
  let matchRepo: MockType<Repository<Match>>;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: matchRepoToken, useFactory: repositoryMockFactory },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepo = module.get<MockType<Repository<Match>>>(matchRepoToken);
  });

  const match = {
    matchId: 1,
    teamId: 1,
    scheduledTime: 46544654,
    startTime: 255,
    halfTime: 66,
    fullTime: null,
    opponentTeamName: '46544655',
    isHomeTeam: true,
    createdDate: new Date(),
    updatedDate: new Date(),
  } as Match;

  it('check if service defined', () => {
    expect(matchService).toBeDefined();
  });

  describe('Scheduling a match', () => {
    const createMatchDto: CreateMatchDTO = {
      teamId: 1,
      scheduledTime: 100,
      isHomeTeam: true,
      opponentTeamName: 'bad team name',
    };
    it('should call create on match repo once with all required not-null values of a match', async () => {
      const {
        teamId,
        scheduledTime,
        opponentTeamName,
        isHomeTeam,
      } = createMatchDto;

      await matchService.createMatch(
        teamId,
        scheduledTime,
        opponentTeamName,
        isHomeTeam,
      );

      expect(matchRepo.create).toBeCalledTimes(1);
    });

    it('repo save should be called with an object of Match type', async () => {
      const {
        teamId,
        scheduledTime,
        opponentTeamName,
        isHomeTeam,
      } = createMatchDto;

      const expected = matchRepo.create({
        teamId,
        scheduledTime,
        opponentTeamName,
        isHomeTeam,
      });

      await matchService.createMatch(
        teamId,
        scheduledTime,
        opponentTeamName,
        isHomeTeam,
      );

      expect(matchRepo.save).toBeCalledTimes(1);
      expect(matchRepo.save).toBeCalledWith(expected);
    });
  });

  describe('Starting a match', () => {
    const startMatchDTO: StartMatchDTO = {
      matchId: 1,
      time: 565,
    };
    it('should throw an error if matchId is null', async () => {
      const { time } = startMatchDTO;
      const badMatchId = null;
      try {
        await matchService.startMatch(badMatchId, time);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('matchId cannot be null');
      }
    });

    it('should call a find method with matchId', async () => {
      const { matchId, time } = startMatchDTO;
      matchRepo.findOneOrFail.mockReturnValueOnce(match);

      await matchService.startMatch(matchId, time);
      expect(matchRepo.findOneOrFail).toBeCalledWith({ matchId });
    });

    it('should call save with startTime defined', async () => {
      const { matchId, time } = startMatchDTO;
      matchRepo.findOneOrFail.mockReturnValueOnce(match);
      const expected = { ...match, startTime: time };

      await matchService.startMatch(matchId, time);

      expect(matchRepo.save).toBeCalledWith(expected);
    });
  });
});
