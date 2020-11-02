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

  @ApiResponse({
    status: 200,
    description: 'Gets user data for currently authenticated user.',
  })
  @ApiResponse({ status: 400, description: 'User data not found.' })
  @ApiResponse({ status: 401, description: 'User is not authenticated.' })
  @ApiResponse({ status: 500, description: 'Unknown exception ocurred.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUserDetails(@Request() { user }: RequestUser) {
    let userData;
    try {
      userData = await this.usersService.findOne(user.username);
    } catch (error) {
      throw new InternalServerErrorException(
        "We don't know what went wrong :(",
      );
    }
    if (!userData) {
      throw new BadRequestException('User not found.');
    }
    const returnable = { ...userData };
    delete returnable.password;
    return returnable;
  }

  @ApiResponse({ status: 201, description: 'Creates a new user account.' })
  @ApiResponse({
    status: 400,
    description: 'Passwords must be identical.',
  })
  @ApiResponse({
    status: 401,
    description: 'Cannot create a user if you are logged in.',
  })
  @ApiResponse({
    status: 409,
    description: 'Username is taken.',
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
