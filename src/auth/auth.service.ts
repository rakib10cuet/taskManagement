import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InsertSignUpDto, SignInDto } from './dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(insertSignUpDto: InsertSignUpDto) {
    const user = await this.usersService.create(insertSignUpDto);
    return user;
  }
  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByName(signInDto.username);
    if (user) {
      if (user && user.password !== signInDto.password) {
        throw new UnauthorizedException();
      }
      const payload = { username: user.username, sub: user.userId };
      return {
        access_token: await this.jwtService.signAsync(payload),
        userData: user,
      };
    } else {
      throw new UnauthorizedException();
    }
  }
  async checkUniqueUserName(username: string) {
    const userData = await this.usersService.findOneByName(username);
    return userData ? true : false;
  }
}
