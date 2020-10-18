import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/db/entities/user.entity';
import { MockType } from './mocks/mockType';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';

describe('UsersService', () => {
  const userRepoToken = getRepositoryToken(User);
  let userRepo: MockType<Repository<User>>;
  let service: UsersService;

  jest.spyOn(Date, 'now').mockImplementation(() => 1603044974000);

  const saveDefaults = {
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: userRepoToken, useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<MockType<Repository<User>>>(userRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  // Broken tests
  // describe('creating a user', () => {
  //   const userData = {
  //     name: 'testName',
  //     username: 'testUsername',
  //     password: 'testPassword',
  //   };

  //   const userCreatedData = {
  //     name: 'testName',
  //     username: 'testUsername',
  //     userId: 24,
  //     password: '$2b$10$OcXuQKgoKdXe1Ns0xVFEUO0bnAY48ZJIYhr1qJzLsmJtZ6ipDFAVe',
  //     ...saveDefaults,
  //   } as User;

  //   it('can create users', async () => {
  //     const { name, username, password } = userData;
  //     const result = await service.create(name, username, password);
  //     userRepo.create.mockReturnValueOnce(userData);
  //     userRepo.save.mockReturnValueOnce(Promise.resolve(userCreatedData));

  //     expect(userRepo.create).toBeCalledTimes(1);
  //     expect(userRepo.save).toBeCalledTimes(1);
  //     expect(result).toHaveProperty('userId');
  //     expect(result).toHaveProperty('name');
  //     expect(result).toHaveProperty('username');
  //   });
  //});
});
