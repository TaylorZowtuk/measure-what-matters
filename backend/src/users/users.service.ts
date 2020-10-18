import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, username: string, password: string) {
    const newUser = this.userRepository.create({
      name,
      username,
      password,
    });
    console.log(newUser);
    const result = await this.userRepository.save(newUser);
    console.log(result);
    delete result.password;
    return result;
  }

  findOne(username: string) {
    return this.userRepository.findOne({ username });
  }
}
