import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from '../dto/users/createUser.dto';
import { QueryFailedError } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() data: CreateUserDTO) {
    try {
      if (data.password1 !== data.password2) {
        throw 'Passwords must match!';
      }
      return await this.usersService.create(
        data.name,
        data.username,
        data.password1,
      );
    } catch (error) {
      if (typeof error === 'string') {
        return new BadRequestException(error);
      }
      if (error instanceof QueryFailedError) {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          return new BadRequestException('Username is taken!');
        }
      }
      return new InternalServerErrorException(
        "We don't know what went wrong :(",
      );
    }
  }
}
