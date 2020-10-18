import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { jwtStrategyMockFactory } from './mocks/jwtStrategyMockFactory';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: 'JwtService', useFactory: jwtStrategyMockFactory },
        { provide: 'UserRepository', useClass: Repository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
