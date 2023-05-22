import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
// Redis Call
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private helperService: HelperService,
  ) {}
  async create(insertSignUpDto: CreateUserDto) {
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
        data: { userData: payload, userId: userId },
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
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
