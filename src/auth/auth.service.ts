import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// Redis Call
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const payload = {
      id: signUpDto.id,
      username: signUpDto.username,
      email: signUpDto.email,
      password: signUpDto.password,
      contact_number: signUpDto.contact_number,
      address: signUpDto.address,
    };
    await this.redisService.setRedis(
      'user' + payload.id,
      JSON.stringify(payload),
    );
    await this.redisService.setRedis(
      'username_' + payload.username,
      JSON.stringify(payload.id),
    );
    return {
      message: 'Sucessfully Registration Complete!!!',
      userData: payload,
    };
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
