import { TestingModule, Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PossessionService } from '../src/event/possession/possession.service';
import { PossessionController } from '../src/event/possession/possession.controller';

describe('PossessionController', () => {
  let controller: PossessionController;
  let possessionService: PossessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PossessionController],
      providers: [
        PossessionService,
        { provide: 'PossessionRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<PossessionController>(PossessionController);
    possessionService = module.get<PossessionService>(PossessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(possessionService).toBeDefined();
  });

  // TODO, some actual tests
});
