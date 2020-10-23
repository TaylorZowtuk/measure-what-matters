import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await compare(pass, user.password))) {
      delete user.password; // strip off password
      return user;
    }
    return null;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
