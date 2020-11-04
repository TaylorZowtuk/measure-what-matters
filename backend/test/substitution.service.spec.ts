import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Substitution } from '../src/db/entities/events/substitution.entity';
import { SubstitutionExchangeDTO } from '../src/dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../src/dto/events/substitution/substitution.dto';
import { SubstitutionService } from '../src/event/substitution/substitution.service';

const createQueryBuilder: any = {
  update: () => createQueryBuilder,
  set: () => createQueryBuilder,
  where: () => createQueryBuilder,
  andwhere: () => createQueryBuilder,
};

const startingSubs: SubstitutionDTO[] = [
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

const sub: SubstitutionExchangeDTO = {
  playerIdIn: 1,
  playerIdOut: 2,
  time: 500,
  matchId: 1,
};

const subDto: SubstitutionDTO = {
  playerId: 1,
  timeOn: 500,
  matchId: 1,
};

const subEntity: Substitution = new Substitution();
subEntity.playerId = 1;
subEntity.timeOn = 500;
subEntity.matchId = 1;

describe('SubstitutionService', () => {
  let service: SubstitutionService;
  let subRepo: Repository<Substitution>;
  let saveSpy;
  let updateSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubstitutionService,
        { provide: 'SubstitutionRepository', useClass: Repository },
      ],
    }).compile();

    service = module.get<SubstitutionService>(SubstitutionService);
    subRepo = module.get<Repository<Substitution>>(
      getRepositoryToken(Substitution),
    );
    saveSpy = jest.spyOn(subRepo, 'save').mockResolvedValue(subEntity);
    updateSpy = jest
      .spyOn(subRepo, 'update')
      .mockResolvedValue(new UpdateResult());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save starting subs to the db', async () => {
    await service.createStartingSubs(startingSubs);
    expect(saveSpy).toHaveBeenCalledWith(startingSubs);
  });

  it('should add player in sub to the db', async () => {
    await service.saveSubstitution(sub);
    expect(saveSpy).toBeCalledWith(subDto);
  });

  it('should update player out sub in the db', async () => {
    await service.saveSubstitution(sub);
    expect(updateSpy).toBeCalledWith(
      {
        playerId: sub.playerIdOut,
        timeOff: null,
      },
      {
        timeOff: sub.time,
      },
    );
  });
});
