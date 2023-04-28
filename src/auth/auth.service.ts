import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async signup(data: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(data.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: { email: data.email, hash },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log(error.message);
          throw new ForbiddenException('Email already exists.');
        }
      }
      throw error;
    }
  }

  async login(data: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect.');

    // compare password
    const pwdMatches = await argon.verify(user.hash, data.password);

    // if password incorrect throw exception
    if (!pwdMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { sub: userId, email },
      { expiresIn: '1h', secret: this.config.get('JWT_SECRET') },
    );

    return { access_token: token };
  }
}
