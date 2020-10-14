import { TestingModule, Test } from "@nestjs/testing";
import { GoalDTO } from "src/dto/events/goal.dto";
import { GoalService } from "src/services/goal/goal.service";
import { EventController } from "./event.controller";


describe('EventController', () => {
  let controller: EventController;
  let goalService: GoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        GoalService
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
    goalService = module.get<GoalService>(GoalService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call event service to create goal event', () => {
    var goal: GoalDTO = new GoalDTO();
    jest.spyOn(goalService, 'saveGoal').mockImplementation((goal) => { return new Promise<void>(() => {}) });
    controller.saveGoalEvent(goal);
    expect(goalService).toBeCalledTimes(1);
  });
});
