import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../dto/users/createUser.dto';
import { QueryFailedError } from 'typeorm';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../types/requestUser.type';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/')
  async getUserDetails(@Request() { user }: RequestUser) {
    try {
      const userData = await this.usersService.findOne(user.username);
      if (!userData) {
        throw 'No user found!';
      }
      const returnable = { ...userData };
      delete returnable.password;
      return returnable;
    } catch (error) {
      if (typeof error === 'string') {
        return new BadRequestException(error);
      }
      return new InternalServerErrorException(
        "We don't know what went wrong :(",
      );
    }
  }

  @ApiResponse({ status: 201, description: 'Creates a new user account.' })
  @ApiResponse({
    status: 409,
    description: 'Username is taken.',
  })
  @ApiResponse({
    status: 400,
    description: 'Passwords must be identical.',
  })
  @ApiResponse({
    status: 401,
    description: 'Cannot create a user if you are logged in.',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown exception ocurred.',
  })
  @Post('/create')
  async createUser(
    @Body() data: CreateUserDTO,
    @Request() { user }: RequestUser,
  ) {
    // Guard checks
    if (user) {
      throw new UnauthorizedException(
        'Cannot create a new user from an existing account.',
      );
    }
    if (data.password1 !== data.password2) {
      throw new BadRequestException('Passwords must match.');
    }

    // Create the user
    try {
      return await this.usersService.create(
        data.name,
        data.username,
        data.password1,
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          throw new ConflictException('Username is taken.');
        }
      }
    }

    // If error uncaught throw a custom message
    throw new InternalServerErrorException("We don't know what went wrong :(");
  }
}
