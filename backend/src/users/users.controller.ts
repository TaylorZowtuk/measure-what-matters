import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
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
import { EditUserDTO } from '../dto/users/editUser.dto';

@ApiTags('Users')
@ApiResponse({
  status: 500,
  description: 'Unknown exception ocurred.',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Gets user data for currently authenticated user.',
  })
  @ApiResponse({
    status: 400,
    description: 'User data not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authenticated.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserDetails(@Request() { user }: RequestUser) {
    let userData;
    try {
      userData = await this.usersService.findOne(user.userId);
    } catch (error) {
      throw new InternalServerErrorException(
        "We don't know what went wrong :(",
      );
    }
    if (!userData) {
      throw new BadRequestException('User not found.');
    }
    return userData;
  }

  @ApiResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiBearerAuth()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('profile/edit')
  async editUser(@Body() data: EditUserDTO, @Request() { user }: RequestUser) {
    try {
      return await this.usersService.update(user.userId, data.name);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Creates a new user account.',
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
    status: 409,
    description: 'Username is taken.',
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
