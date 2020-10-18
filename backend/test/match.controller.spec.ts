import { TestingModule, Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MatchDTO } from '../src/dto/match/match.dto';
import { MatchController } from '../src/match/match.controller';
import { MatchService } from '../src/match/match.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Goal } from 'src/db/entities/events/goal.entity';

const matchDtos: MatchDTO[] = [
  {
    teamId: 1,
    time: 100,
    isHomeTeam: false,
  },
  {
    teamId: 2,
    time: 500,
    isHomeTeam: false,
  },
];

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        MatchService,
        { provide: 'MatchRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call match service to start a match', () => {
    const match: MatchDTO = new MatchDTO();
    const spy = jest.spyOn(matchService, 'saveMatch').mockImplementation(() => {
      return new Promise<number>(() => {
        return;
      });
    });
    controller.startMatch(match);
    expect(spy).toBeCalledWith(match);
  });

  it('should call match service to get matches by team id', () => {
    const teamId = 1;
    jest.spyOn(matchService, 'getMatches').mockResolvedValue(matchDtos);
    const response = controller.getMatchesByTeamId(teamId);
    expect(response).resolves.toBe(matchDtos);
  });


});
