import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
