import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneForAuth(username);
    if (user && (await compare(pass, user.password))) {
      const userWithoutPass = { ...user };
      delete userWithoutPass.password; // strip off password
      return userWithoutPass;
    }
    return null;
  }

  login(user: JwtPayload) {
    const payload = { username: user.username, sub: user.userId };
    return {
      userId: user.userId,
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
