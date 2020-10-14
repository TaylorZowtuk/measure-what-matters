import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Goal } from "src/db/entities/events/goal.entity";
import { GoalDTO } from "src/dto/events/goal.dto";
import { GoalService } from "src/services/goal/goal.service";
import { Repository } from "typeorm";
import { EventController } from "./event.controller";


describe('EventController', () => {
  let controller: EventController;
  let goalService: GoalService;
  let goalRepository: Repository<Goal>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        GoalService,
        {provide: 'GoalRepository', useClass: Repository}
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
    goalService = module.get<GoalService>(GoalService);
    goalRepository = module.get<Repository<Goal>>(getRepositoryToken(Goal));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call event service to create goal event', () => {
    var goal: GoalDTO = new GoalDTO();
    const spy = jest.spyOn(goalService, 'saveGoal').mockImplementation((goal) => {return new Promise<void>(() => {})});
    controller.saveGoalEvent(goal);
    expect(spy).toBeCalledTimes(1);
  });
});
