import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Create
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

  // Read
  findOneForAuth(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async findOne(userId: number): Promise<any> {
    const user = await this.userRepository.findOneOrFail({ userId });
    const userWithoutPass = { ...user };
    delete userWithoutPass.password;
    return userWithoutPass;
  }

  // Update
  async update(userId: number, name: string, teamId: number) {
    const user = await this.findOne(userId);
    const updatedUser = { ...user, name, teamId };
    return this.userRepository.save(updatedUser);
  }
}
