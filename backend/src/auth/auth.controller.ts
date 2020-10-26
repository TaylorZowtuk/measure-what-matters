import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from '../dto/auth/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() credentials: LoginDTO, @Request() req) {
    this.logger.log(
      JSON.stringify({ type: 'LOGIN', user: credentials.username }),
    );
    return this.authService.login(req.user);
  }
}
