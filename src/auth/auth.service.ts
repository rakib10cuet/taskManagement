import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InsertSignUpDto } from './dto';
import { RedisService } from 'src/redis/redis.service';
import { HelperService } from 'src/helper/helper.service';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
// import { KnexerrorService } from 'src/knex-error/knex-error.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    // private knexerrorService: KnexerrorService,
    private helperService: HelperService,
    private redisService: RedisService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(insertSignUpDto: InsertSignUpDto) {
    try {
      const payload = {
        username: insertSignUpDto.username,
        email: insertSignUpDto.email,
        password: insertSignUpDto.password,
        contact_number: insertSignUpDto.contact_number,
        address: insertSignUpDto.address,
        user_status: 1,
        user_details: insertSignUpDto.user_details,
        created_at: await this.helperService.cmnDatetime(),
      };
      const userId = await this.knex
        .table('sys_users')
        .insert(payload, 'id')
        .then(async function (userId) {
          return userId;
        });
      await this.redisService.setRedis(
        'user' + userId,
        JSON.stringify(payload),
      );
      await this.redisService.setRedis(
        'username_' + payload.username,
        JSON.stringify(userId),
      );
      return {
        message: 'Sucessfully Registration Complete!!!',
        userData: payload,
        userId: userId,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userData: user,
    };
  }
}
