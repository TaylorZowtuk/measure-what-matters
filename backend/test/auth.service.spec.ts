import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { jwtStrategyMockFactory } from './mocks/jwtStrategyMockFactory';
import { User } from '../src/db/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from '../src/interface/jwtPayload.interface';

describe('AuthService', () => {
  const userRepoToken = getRepositoryToken(User);
  let jwtService: JwtService;
  let userService: UsersService;
  let service: AuthService;

  jest.spyOn(Date, 'now').mockImplementation(() => 1603044974000);

  const saveDefaults = {
    createdDate: new Date(),
    updatedDate: new Date(),
  };

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
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Validating a user', () => {
    const userData = {
      name: 't',
      username: 't',
      password: 't',
    };

    const userCreatedData = {
      name: 't',
      username: 't',
      userId: 24,
      password: '$2b$10$b2lh9h2OPSFjYwowE1siDeYImBPaVwlZDvWt.P9xNVWC3UAxXNm3e',
      ...saveDefaults,
    } as User;

    it('should call the user service to find the user by username', async () => {
      const { username, password } = userData;

      const spy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValueOnce(userCreatedData);

      await service.validateUser(username, password);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(username);
    });

    it('should return the user without their password, if credentials are valid', async () => {
      const { username, password } = userData;
      const userDataWithoutPass = { ...userCreatedData };
      delete userDataWithoutPass.password;

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(userCreatedData);

      const result = await service.validateUser(username, password);
      expect(result).toMatchObject(userDataWithoutPass);
    });

    it('should return null, if the user credentials are invalid', async () => {
      const { username } = userData;
      const invalidPassword = 'Bad boi password';

      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(userCreatedData);

      const result = await service.validateUser(username, invalidPassword);
      expect(result).toBe(null);
    });
  });

  describe('Logging in a User', () => {
    const userPayload: JwtPayload = {
      userId: 5,
      username: 't',
    };

    const authResponse = {
      username: 't',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InQiLCJzdWIiOjIsImlhdCI6MTYwMzY4MTIxMywiZXhwIjoxNjAzNjgxNTEzfQ.AEhiKgegHhGEHV3qlzzbXucs_Xy2Uptte4cZ-NMqKbw',
    };
    it('should call sign on jwtService to generate the userAuth token', async () => {
      const spy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(authResponse.accessToken);

      await service.login(userPayload);

      expect(spy).toBeCalledTimes(1);
    });

    it('should return an object with username and accessToken', async () => {
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(authResponse.accessToken);

      const result = await service.login(userPayload);

      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('accessToken');
      expect(result.username).toBe(authResponse.username);
      expect(result.accessToken).toBe(authResponse.accessToken);
    });
  });
});
