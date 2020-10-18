import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { SubstitutionExchangeDTO } from '../src/dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../src/dto/events/substitution/substitution.dto';
import { SubstitutionController } from '../src/event/substitution/substitution.controller';
import { SubstitutionService } from '../src/event/substitution/substitution.service';

describe('SubstitutionController', () => {
  let controller: SubstitutionController;
  let substitutionService: SubstitutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubstitutionController],
      providers: [
        SubstitutionService,
        { provide: 'SubstitutionRepository', useClass: Repository }
      ]
    }).compile();

    controller = module.get<SubstitutionController>(SubstitutionController);
    substitutionService = module.get<SubstitutionService>(SubstitutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call sub service to create starting substitutions', () => {
    const subs: SubstitutionDTO[] = [
      {
        playerId: 1,
        matchId: 1,
        timeOn: 5999
      },
      {
        playerId: 2,
        matchId: 1,
        timeOn: 5999
      },
      {
        playerId: 3,
        matchId: 1,
        timeOn: 5999
      }
    ]
    const spy = jest.spyOn(substitutionService, 'createStartingSubs').mockResolvedValue(undefined);
    controller.createStartingSubs(subs);
    expect(spy).toHaveBeenCalledWith(subs);
  });

  it('should call sub service to create a substitution event', () => {
    const subExchangeDto: SubstitutionExchangeDTO = {
      playerIdIn: 1,
      playerIdOut: 2,
      time: 453345,
      matchId: 1
    }
    const spy = jest.spyOn(substitutionService, 'saveSubstitution').mockResolvedValue(undefined);
    controller.saveSubstitutionEvent(subExchangeDto);
    expect(spy).toHaveBeenCalledWith(subExchangeDto);
  });

});
