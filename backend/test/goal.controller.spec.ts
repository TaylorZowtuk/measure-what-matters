import { TestingModule, Test } from '@nestjs/testing';
import { GoalDTO } from '../src/dto/events/goal.dto';
import { GoalService } from '../src/event/goal/goal.service';
import { Repository } from 'typeorm';
import { GoalController } from '../src/event/goal/goal.controller';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Goal } from 'src/db/entities/events/goal.entity';

const goalDtos: GoalDTO[] = [
  {
    matchId: 1,
    playerId: 1,
    time: 200,
    lineup: [1, 2, 3, 4, 5, 6],
  },
  {
    matchId: 1,
    playerId: 1,
    time: 500,
    lineup: [1, 2, 8, 9, 5, 6],
  },
];

describe('GoalController', () => {
  let controller: GoalController;
  let goalService: GoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [
        GoalService,
        { provide: 'GoalRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<GoalController>(GoalController);
    goalService = module.get<GoalService>(GoalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call goal service to create goal event', () => {
    const goal: GoalDTO = new GoalDTO();
    const spy = jest.spyOn(goalService, 'saveGoal').mockImplementation(() => {
      return new Promise<void>(() => {
        return;
      });
    });
    controller.saveGoalEvent(goal);
    expect(spy).toBeCalledWith(goal);
  });

  it('should call goal service to get goals by player id', () => {
    const playerId = 1;
    jest.spyOn(goalService, 'getGoalsByPlayerId').mockResolvedValue(goalDtos);
    const response = controller.getGoalByPlayer(playerId);
    expect(response).resolves.toBe(goalDtos);
  });

  it('should call goal service to get goals by match id', () => {
    const matchId = 1;
    jest.spyOn(goalService, 'getGoalsByMatchId').mockResolvedValue(goalDtos);
    const response = controller.getGoalByMatch(matchId);
    expect(response).resolves.toBe(goalDtos);
  });
});
