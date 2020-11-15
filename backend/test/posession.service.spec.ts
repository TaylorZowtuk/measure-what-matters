import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';
import { PossessionService } from '../src/event/possession/possession.service';
import { Possession } from '../src/db/entities/events/possession.entity';

describe('PossessionService', () => {
  let possessionService: PossessionService;
  let possessionRepository: Repository<Possession>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PossessionService,
        { provide: 'PossessionRepository', useClass: Repository },
        { provide: 'PlayerRepository', useFactory: repositoryMockFactory },
      ],
    }).compile();

    possessionService = module.get<PossessionService>(PossessionService);
    possessionRepository = module.get<Repository<Possession>>(
      getRepositoryToken(Possession),
    );
  });

  it('should be defined', () => {
    expect(possessionService).toBeDefined();
    expect(possessionRepository).toBeDefined();
  });

  // TODO, some actual tests
});
