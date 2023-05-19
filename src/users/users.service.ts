import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Redis Call
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(private redisService: RedisService) {}
  async findOne(username: string) {
    const userId = await this.redisService.getRedis('username_' + username);
    const userDetails = JSON.parse(
      await this.redisService.getRedis('user' + userId),
    );
    if (userDetails === undefined) {
      throw new HttpException(`Data Not Found`, HttpStatus.NOT_FOUND);
    }
    return userDetails;
  }
  async findAll(limit: number, offset: number) {
    console.log(limit, offset);
    // const userDetails = this.users;
    // if (userDetails === undefined && userDetails.length < 1) {
    //   throw new HttpException(`Data Not Found`, HttpStatus.NOT_FOUND);
    // }
    // return userDetails;
  }
  async findOneById(userId: number) {
    const userDetails = JSON.parse(
      await this.redisService.getRedis('user' + userId),
    );
    if (userDetails === undefined) {
      throw new HttpException(`Data Not Found`, HttpStatus.NOT_FOUND);
    }
    return userDetails;
  }
}
