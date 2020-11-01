import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../src/db/entities/events/goal.entity';
import { GoalDTO } from '../src/dto/events/goal.dto';
import { Repository } from 'typeorm';
import { GoalService } from '../src/event/goal/goal.service';
import { PlayerService } from '../src/player/player.service';
import { Player } from '../src/db/entities/player.entity';
import { InvalidLineupError } from '../src/exceptions/lineup.exception';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';

const goalDto: GoalDTO = {
  matchId: 1,
  playerId: 1,
  time: 200,
  lineup: [1, 2, 3, 4, 5, 6],
};

const goalDtos: GoalDTO[] = [goalDto];

const goal = new Goal();
goal.id = 1;
goal.playerId = 1;
goal.matchId = 1;
goal.time = 200;
goal.lineup = [1, 2, 3, 4, 5, 6];

const goalEntities: Goal[] = [goal];

describe('GoalService', () => {
  let goalService: GoalService;
  let goalRepository: Repository<Goal>;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalService,
        PlayerService,
        { provide: 'GoalRepository', useClass: Repository },
        { provide: 'PlayerRepository', useFactory: repositoryMockFactory },
      ],
    }).compile();

    goalService = module.get<GoalService>(GoalService);
    playerService = module.get<PlayerService>(PlayerService);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
    jest.spyOn(playerService, 'getPlayers').mockResolvedValue([new Player()]);
  });

  it('should be defined', () => {
    expect(goalService).toBeDefined();
  });

  it('should add goal event to db', async () => {
    const spy = jest.spyOn(goalRepository, 'save').mockResolvedValue(goal);
    await goalService.saveGoal(goalDto);
    expect(spy).toHaveBeenCalledWith(goalDto);
  });

  it('should throw error if lineup is invalid', async () => {
    const player: Player = new Player();
    jest
      .spyOn(playerService, 'getPlayers')
      .mockResolvedValue([player, undefined]);
    await expect(goalService.saveGoal(goalDto)).rejects.toThrow(
      InvalidLineupError,
    );
  });

  it('should get goals with specified player id', async () => {
    jest.spyOn(goalRepository, 'find').mockResolvedValue(goalEntities);
    const goals = await goalService.getGoalsByPlayerId(goal.playerId);
    expect(goals).toEqual(goalDtos);
  });

  it('should get goals with specified matchId', async () => {
    jest.spyOn(goalRepository, 'find').mockResolvedValue(goalEntities);
    const goals = await goalService.getGoalsByMatchId(goal.matchId);
    expect(goals).toEqual(goalDtos);
  });

  it('should get goals with specified matchId and player id', async () => {
    jest.spyOn(goalRepository, 'find').mockResolvedValue(goalEntities);
    const goals = await goalService.getGoalsForPlayerInMatch(
      goal.playerId,
      goal.matchId,
    );
    expect(goals).toEqual(goalDtos);
  });
});
