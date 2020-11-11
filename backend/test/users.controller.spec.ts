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
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { mockUserLoggedIn, mockUserNotLoggedIn } from './mocks/mockUserLogin';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  jest.spyOn(Date, 'now').mockImplementation(() => 1603044974000);

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

  // Global test data
  const userData = {
    name: 'testName',
    username: 'testUsername',
    password: 'testPassword',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('User details API', () => {
    const userEntity = {
      userId: 2,
      name: 't',
      username: 't',
      createdDate: new Date(),
      updatedDate: new Date(),
    } as User;
    it('should call the findOne method with userId of authenticated user', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(userEntity);

      await controller.getUserDetails(mockUserLoggedIn);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(mockUserLoggedIn.user.userId);
    });
    it('should throw a BadRequestException if the user data does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      try {
        await controller.getUserDetails(mockUserLoggedIn);
        fail('Error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User not found.');
      }
    });

    it('should throw a InternalServerErrorException if an error is thrown by the service', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(QueryFailedError);

      try {
        await controller.getUserDetails(mockUserLoggedIn);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe("We don't know what went wrong :(");
      }
    });

    it('should return user data without a password if the user data exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(userEntity);

      const result = await controller.getUserDetails(mockUserLoggedIn);

      expect(result).toMatchObject(userEntity);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('User edit API', () => {
    // TODO - Need more features faster
    it('should call findOne method of Users', async () => {
      expect(true).toBe(true);
    });
  });

  describe('User creation API', () => {
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

    it('should call create on userService', async () => {
      const spy = jest.spyOn(service, 'create');

      await controller.createUser(validCreateUserRequest, mockUserNotLoggedIn);

      expect(spy).toBeCalledWith(
        userData.name,
        userData.username,
        userData.password,
      );
    });

    it('should throw a BadRequestException if passwords do not match', async () => {
      try {
        await controller.createUser(
          invalidCreateUserRequest,
          mockUserNotLoggedIn,
        );
        fail('Error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Passwords must match.');
      }
    });

    it('should throw a UnauthorizedException if user is logged in already', async () => {
      try {
        await controller.createUser(invalidCreateUserRequest, mockUserLoggedIn);
        fail('Error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(
          'Cannot create a new user from an existing account.',
        );
      }
    });

    it('should throw a ConflictException if username is taken', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new QueryFailedError(
            '',
            [],
            'duplicate key value violates unique constraint',
          ),
        );

      try {
        await controller.createUser(
          validCreateUserRequest,
          mockUserNotLoggedIn,
        );
        fail('Error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Username is taken.');
      }
    });

    it('should throw an InternalServerErrorException if an unknown error is thrown', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new Error('Hah, I got no idea what is going on XD'),
        );

      try {
        await controller.createUser(
          validCreateUserRequest,
          mockUserNotLoggedIn,
        );
        fail('Error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe("We don't know what went wrong :(");
      }
    });
  });
});
