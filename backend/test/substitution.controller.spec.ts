import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError, Repository } from 'typeorm';
import { SubstitutionExchangeDTO } from '../src/dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../src/dto/events/substitution/substitution.dto';
import { SubstitutionController } from '../src/event/substitution/substitution.controller';
import { SubstitutionService } from '../src/event/substitution/substitution.service';

const subExchangeDto: SubstitutionExchangeDTO = {
  playerIdIn: 1,
  playerIdOut: 2,
  time: 453345,
  matchId: 1,
};

const subs: SubstitutionDTO[] = [
  {
    playerId: 1,
    matchId: 1,
    timeOn: 5999,
  },
  {
    playerId: 2,
    matchId: 1,
    timeOn: 5999,
  },
  {
    playerId: 3,
    matchId: 1,
    timeOn: 5999,
  },
];

describe('SubstitutionController', () => {
  let controller: SubstitutionController;
  let substitutionService: SubstitutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubstitutionController],
      providers: [
        SubstitutionService,
        { provide: 'SubstitutionRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<SubstitutionController>(SubstitutionController);
    substitutionService = module.get<SubstitutionService>(SubstitutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call sub service to create starting substitutions', async () => {
    const spy = jest
      .spyOn(substitutionService, 'createStartingSubs')
      .mockResolvedValue(undefined);
    await controller.createStartingSubs(subs);
    expect(spy).toHaveBeenCalledWith(subs);
  });

  it('should call sub service to create a substitution event', async () => {
    const spy = jest
      .spyOn(substitutionService, 'saveSubstitution')
      .mockResolvedValue(undefined);
    await controller.saveSubstitutionEvent(subExchangeDto);
    expect(spy).toHaveBeenCalledWith(subExchangeDto);
  });

  it('should return bad request if not null violation', async () => {
    const error: QueryFailedError = new QueryFailedError('', [], '');
    error.message = 'violates not-null constraint';
    jest
      .spyOn(substitutionService, 'saveSubstitution')
      .mockRejectedValue(error);
    jest
      .spyOn(substitutionService, 'createStartingSubs')
      .mockRejectedValue(error);
    await expect(controller.createStartingSubs(subs)).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      controller.saveSubstitutionEvent(subExchangeDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return bad request if foreign key violation', async () => {
    const error: QueryFailedError = new QueryFailedError('', [], '');
    error.message = 'violates foreign key constraint';
    jest
      .spyOn(substitutionService, 'saveSubstitution')
      .mockRejectedValue(error);
    jest
      .spyOn(substitutionService, 'createStartingSubs')
      .mockRejectedValue(error);
    await expect(controller.createStartingSubs(subs)).rejects.toThrow(
      BadRequestException,
    );
    await expect(
      controller.saveSubstitutionEvent(subExchangeDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return internal server err for other errors', async () => {
    const error: Error = new Error();
    jest
      .spyOn(substitutionService, 'saveSubstitution')
      .mockRejectedValue(error);
    jest
      .spyOn(substitutionService, 'createStartingSubs')
      .mockRejectedValue(error);
    await expect(controller.createStartingSubs(subs)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(
      controller.saveSubstitutionEvent(subExchangeDto),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
