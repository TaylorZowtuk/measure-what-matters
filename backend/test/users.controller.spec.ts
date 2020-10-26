import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/db/entities/user.entity';
import { repositoryMockFactory } from './mocks/repositoryMockFactory';
import { CreateUserDTO } from '../src/dto/users/createUser.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  jest.spyOn(Date, 'now').mockImplementation(() => 1603044974000);

  const saveDefaults = {
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('User creation API', () => {
    const userData = {
      name: 'testName',
      username: 'testUsername',
      password: 'testPassword',
    };

    const validCreateUserRequest: CreateUserDTO = {
      name: userData.name,
      username: userData.username,
      password1: userData.password,
      password2: userData.password,
    };

    const invalidCreateUserRequest: CreateUserDTO = {
      name: userData.name,
      username: userData.username,
      password1: userData.password,
      password2: 'Naughty password that should not be here!',
    };

    const userCreatedData = {
      name: 'testName',
      username: 'testUsername',
      userId: 24,
      password: '$2b$10$OcXuQKgoKdXe1Ns0xVFEUO0bnAY48ZJIYhr1qJzLsmJtZ6ipDFAVe',
      ...saveDefaults,
    } as User;

    it('should call create on userService', async () => {
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(userCreatedData);

      await controller.createUser(validCreateUserRequest);

      expect(spy).toBeCalledWith(
        userData.name,
        userData.username,
        userData.password,
      );
    });

    it('should throw a BadRequestException if passwords do not match', async () => {
      const result = await controller.createUser(invalidCreateUserRequest);

      expect(result).toBeInstanceOf(BadRequestException);

      if (result instanceof BadRequestException) {
        expect(result.message).toBe('Passwords must match!');
      }
    });

    it('should throw a BadRequestException if username is taken', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new QueryFailedError(
            '',
            [],
            'duplicate key value violates unique constraint',
          ),
        );

      const result = await controller.createUser(validCreateUserRequest);
      expect(result).toBeInstanceOf(BadRequestException);
      if (result instanceof BadRequestException) {
        expect(result.message).toBe('Username is taken!');
      }
    });

    it('should throw an InternalServerErrorException if an unknown error is thrown', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new Error('Hah, I got no idea what is going on XD'),
        );

      const result = await controller.createUser(validCreateUserRequest);
      expect(result).toBeInstanceOf(InternalServerErrorException);
      if (result instanceof InternalServerErrorException) {
        expect(result.message).toBe("We don't know what went wrong :(");
      }
    });
  });
});
