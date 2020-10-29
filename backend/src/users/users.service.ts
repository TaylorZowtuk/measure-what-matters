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
    const result = await this.userRepository.save(newUser);
    const copyWithoutPass = { ...result };
    delete copyWithoutPass.password;
    return copyWithoutPass;
  }

  findOne(username: string) {
    return this.userRepository.findOne({ username });
  }
}
