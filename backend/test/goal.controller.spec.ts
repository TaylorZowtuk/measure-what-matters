import { TestingModule, Test } from '@nestjs/testing';
import { GoalDTO } from '../src/dto/events/goal.dto';
import { GoalService } from '../src/event/goal/goal.service';
import { QueryFailedError, Repository } from 'typeorm';
import { GoalController } from '../src/event/goal/goal.controller';
import { PlayerService } from '../src/player/player.service';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { InvalidLineupError } from '../src/exceptions/lineup.exception';

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
        PlayerService,
        { provide: 'GoalRepository', useClass: Repository },
        { provide: 'PlayerRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<GoalController>(GoalController);
    goalService = module.get<GoalService>(GoalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call goal service to create goal event', async () => {
    const spy = jest.spyOn(goalService, 'saveGoal').mockResolvedValue();
    await controller.saveGoalEvent(goalDtos[1]);
    expect(spy).toBeCalledWith(goalDtos[1]);
  });

  it('should return bad request if query fails due not null constraint', async () => {
    const error: QueryFailedError = new QueryFailedError('', [], '');
    error.message = 'violates not-null constraint';
    jest.spyOn(goalService, 'saveGoal').mockRejectedValue(error);
    await expect(controller.saveGoalEvent(goalDtos[0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return bad request if query fails due foreign key constraint', async () => {
    const error: QueryFailedError = new QueryFailedError('', [], '');
    error.message = 'violates foreign key constraint';
    jest.spyOn(goalService, 'saveGoal').mockRejectedValue(error);
    await expect(controller.saveGoalEvent(goalDtos[0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return bad request if query fails due to invalid lineup', async () => {
    const error: InvalidLineupError = new InvalidLineupError(
      goalDtos[0].lineup,
    );
    error.message = 'violates foreign key constraint';
    jest.spyOn(goalService, 'saveGoal').mockRejectedValue(error);
    await expect(controller.saveGoalEvent(goalDtos[0])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return internal server err for any other error', async () => {
    const error = new Error();
    jest.spyOn(goalService, 'saveGoal').mockRejectedValue(error);
    await expect(controller.saveGoalEvent(goalDtos[0])).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should call goal service to get goals by player id', async () => {
    const playerId = 1;
    const spy = jest
      .spyOn(goalService, 'getGoalsByPlayerId')
      .mockResolvedValue(goalDtos);
    const response = await controller.getGoals(playerId);
    expect(spy).toBeCalledWith(playerId);
    expect(response).toBe(goalDtos);
  });

  it('should call goal service to get goals by match id', async () => {
    const matchId = 1;
    const spy = jest
      .spyOn(goalService, 'getGoalsByMatchId')
      .mockResolvedValue(goalDtos);
    const response = await controller.getGoals(null, matchId);
    expect(spy).toBeCalledWith(matchId);
    expect(response).toBe(goalDtos);
  });

  it('should call goal service to get goals by player and match id', async () => {
    const matchId = 1;
    const playerId = 1;
    const spy = jest
      .spyOn(goalService, 'getGoalsForPlayerInMatch')
      .mockResolvedValue(goalDtos);
    const response = await controller.getGoals(playerId, matchId);
    expect(spy).toBeCalledWith(playerId, matchId);
    expect(response).toBe(goalDtos);
  });
});
