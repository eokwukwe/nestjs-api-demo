import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  async signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  async login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
