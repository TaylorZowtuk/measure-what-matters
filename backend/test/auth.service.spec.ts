import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { jwtStrategyMockFactory } from './mocks/jwtStrategyMockFactory';
import { User } from '../src/db/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';
import { MockType } from './mocks/mockType';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  const userRepoToken = getRepositoryToken(User);
  let userRepo: MockType<Repository<User>>;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: 'JwtService', useFactory: jwtStrategyMockFactory },
        {
          provide: userRepoToken,
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<MockType<Repository<User>>>(userRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
