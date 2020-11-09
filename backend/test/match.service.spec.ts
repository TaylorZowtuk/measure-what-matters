import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from '../src/match/match.service';
import { Match } from '../src/db/entities/match.entity';
import { CreateMatchDTO } from '../src/dto/match/createMatch.dto';

describe('MatchService Test', () => {
  let matchService: MatchService;
  let matchRepository: Repository<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: 'MatchRepository', useClass: Repository },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  const createMatchDto: CreateMatchDTO = {
    teamId: 1,
    startTime: 100,
    isHomeTeam: true,
  };

  const match = new Match();

  match.teamId = 1;
  match.startTime = 100;
  match.isHomeTeam = true;

  // const matchDtos: CreateMatchDTO[] = [createMatchDto, createMatchDto];
  const matchEntities: Match[] = [match, match];

  it('check if service defined', () => {
    expect(matchService).toBeDefined();
  });

  describe('Saving Matches', () => {
    it('should call save 1 times', async () => {
      const spy = jest.spyOn(matchRepository, 'save').mockResolvedValue(match);
      await matchService.saveMatch(createMatchDto);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('Getting Matches', () => {
    it('matchRepository find method should be called using teamId', async () => {
      const teamId = 1;
      const spy = jest
        .spyOn(matchRepository, 'find')
        .mockResolvedValueOnce(matchEntities);

      await matchService.getMatches(teamId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { teamId } });
    });
  });
});
