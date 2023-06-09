import { User } from '@prisma/client';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { EditUserDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Logged in user details' })
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  @ApiOperation({ summary: 'User edit own details' })
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
