import { Injectable } from '@nestjs/common';

import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, data: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...data },
    });

    delete user.hash;

    return user;
  }
}
