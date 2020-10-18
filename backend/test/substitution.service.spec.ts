import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Substitution } from '../src/db/entities/events/substitution.entity';
import { SubstitutionExchangeDTO } from '../src/dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../src/dto/events/substitution/substitution.dto';
import { SubstitutionService } from '../src/event/substitution/substitution.service';

const createQueryBuilder: any = {
  update: () => createQueryBuilder,
  set: () => createQueryBuilder,
  where: () => createQueryBuilder,
  andwhere: () => createQueryBuilder,
  getRawMany: () => createQueryBuilder,
};

describe('SubstitutionService', () => {
  let service: SubstitutionService;
  let subRepo: Repository<Substitution>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubstitutionService,
        { provide: 'SubstitutionRepository', useClass: Repository }
      ],
    }).compile();

    service = module.get<SubstitutionService>(SubstitutionService);
    subRepo = module.get<Repository<Substitution>>(getRepositoryToken(Substitution));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save starting subs to the db', () => {
    const subs: SubstitutionDTO[] = 
    [
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
    const spy = jest.spyOn(subRepo, 'save');
    service.createStartingSubs(subs);
    expect(spy).toHaveBeenCalledWith(subs);
  });

  it('should add player in sub to the db', async () => {
    const sub: SubstitutionExchangeDTO = {
      playerIdIn: 1,
      playerIdOut: 2,
      time: 500,
      matchId: 1
    }
    const subDto: SubstitutionDTO = {
      playerId: 1,
      timeOn: 500,
      matchId: 1
    }
    const saveSpy = jest.spyOn(subRepo, 'save');
    service.saveSubstitution(sub);
    expect(saveSpy).toBeCalledWith(subDto);
  });

  // it('should update player out sub in the db', async () => {
  //   const sub: SubstitutionExchangeDTO = {
  //     playerIdIn: 1,
  //     playerIdOut: 2,
  //     time: 500,
  //     matchId: 1
  //   }
  //   const queryBuilderSpy = jest.spyOn(subRepo, 'createQueryBuilder');
  //   service.saveSubstitution(sub);
  //   expect(queryBuilderSpy).toHaveBeenCalledTimes(1);
  // });

});
