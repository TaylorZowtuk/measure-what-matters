import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../src/db/entities/events/goal.entity';
import { GoalDTO } from '../src/dto/events/goal.dto';
import { Repository } from 'typeorm';
import { GoalService } from '../src/event/goal/goal.service';

const goalDto: GoalDTO = {
  id: 1,
  matchId: 1,
  playerId: 1,
  time: 200,
  lineup: [1, 2, 3, 4, 5, 6]
};

const goalDtos: GoalDTO[] = [goalDto];

const goal = new Goal();
goal.id = 1;
goal.playerId = 1;
goal.matchId = 1;
goal.time = 200;

const goalEntities: Goal[] = [goal];

describe('GoalService', () => {
  let service: GoalService;
  let goalRepository: Repository<Goal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalService,
        { provide: 'GoalRepository', useClass: Repository },
      ],
    }).compile();

    service = module.get<GoalService>(GoalService);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add goal event to db', () => {
    const spy = jest.spyOn(goalRepository, 'save');
    service.saveGoal(goalDto);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get goals with specified player id', () => {
    jest.spyOn(goalRepository, 'find').mockResolvedValue(goalEntities);
    const goals = service.getGoalsByPlayerId(goal.playerId);
    expect(goals).resolves.toBe(goalDtos);
  });

  it('should get goals with specified matchId', () => {
    jest.spyOn(goalRepository, 'find').mockResolvedValue(goalEntities);
    const goals = service.getGoalsByPlayerId(goal.matchId);
    expect(goals).resolves.toBe(goalDtos);
  });
});
