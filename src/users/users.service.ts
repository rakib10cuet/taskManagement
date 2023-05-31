import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
// Redis Call
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto';
import { KnexerrorService } from 'src/knex-error/knex-error.service';
import { userDetailskey, userIdByNamekey } from 'src/redis-keys';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private knexErrorService: KnexerrorService,
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
        userIdByNamekey(payload.username),
        JSON.stringify(userId),
      );
      await this.redisService.setRedis(
        userDetailskey(userId.toString()),
        JSON.stringify(payload),
      );
      return {
        message: 'Sucessfully Registration Complete!!!',
        data: { userData: payload, userId: userId },
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  //find by username
  async getUserDataFromDB(username: string) {
    return await this.knex('sys_users')
      .select(
        'sys_users.id',
        'sys_users.usercode',
        'sys_users.username',
        'sys_users.email',
        'sys_users.password',
        'sys_users.contact_number',
        'sys_users.address',
        'sys_users.user_image_id',
        'sys_users.user_role_id',
        'sys_users.user_status',
        'sys_users.created_at',
        'sys_users.updated_at',
      )
      .first()
      .where('sys_users.username', username)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
  }
  async findOneByName(username: string) {
    const userId = await this.redisService.getRedis(userIdByNamekey(username));
    if (userId) {
      const redisUserData = JSON.parse(
        await this.redisService.getRedis(userDetailskey(userId.toString())),
      );
      if (!redisUserData) {
        const userDetails = await this.getUserDataFromDB(username);
        await this.redisService.setRedis(
          userDetailskey(userDetails.id.toString()),
          JSON.stringify(userDetails),
        );
        return userDetails;
      }
      return redisUserData;
    } else {
      const userDetails = await this.getUserDataFromDB(username);
      if (userDetails) {
        await this.redisService.setRedis(
          userIdByNamekey(username),
          JSON.stringify(userDetails.id),
        );
        await this.redisService.setRedis(
          userDetailskey(userDetails.id.toString()),
          JSON.stringify(userDetails),
        );
      }
      return userDetails;
    }
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
