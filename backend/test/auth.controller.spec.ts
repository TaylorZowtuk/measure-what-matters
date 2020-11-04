import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { jwtStrategyMockFactory } from './mocks/jwtStrategyMockFactory';
import { Logger } from '@nestjs/common';
import { LoginDTO } from '../src/dto/auth/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        Logger,
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: 'JwtService', useFactory: jwtStrategyMockFactory },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Authentication API', () => {
    const credentials: LoginDTO = {
      username: 't',
      password: 't',
    };

    const authResponse = {
      userId: 1,
      username: 't',
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InQiLCJzdWIiOjIsImlhdCI6MTYwMzY4MTIxMywiZXhwIjoxNjAzNjgxNTEzfQ.AEhiKgegHhGEHV3qlzzbXucs_Xy2Uptte4cZ-NMqKbw',
    };

    it('should call login on authService with username', async () => {
      const spy = jest.spyOn(service, 'login');

      await controller.login(credentials, { user: credentials.username });

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(credentials.username);
    });

    it('should return an object with username and accessToken', async () => {
      jest.spyOn(service, 'login').mockReturnValueOnce(authResponse);

      const response = await controller.login(credentials, {
        user: credentials.username,
      });

      expect(response).toMatchObject(authResponse);
    });

    it('should log that the user has been authenticated', async () => {
      const spy = jest.spyOn(logger, 'log');

      await controller.login(credentials, {
        user: credentials.username,
      });

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(
        JSON.stringify({ type: 'LOGIN', user: credentials.username }),
      );
    });
  });
});
