import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
// Redis Call
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto, UpdateUserDto } from './dto';
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
  // create user
  async create(insertSignUpDto: CreateUserDto) {
    try {
      const payload = {
        username: insertSignUpDto.username,
        email: insertSignUpDto.email,
        password: insertSignUpDto.password,
        contact_number: insertSignUpDto.contact_number,
        primary_address: insertSignUpDto.primary_address,
        secondary_address: insertSignUpDto.secondary_address,
        skills: insertSignUpDto.skills,
        date_of_birth: insertSignUpDto.date_of_birth,
        gender: insertSignUpDto.gender,
        user_status: 1,
        status: 1,
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
  async getUserDataFromDBByName(username: string) {
    return await this.knex('sys_users')
      .select(
        'sys_users.id',
        'sys_users.usercode',
        'sys_users.username',
        'sys_users.email',
        'sys_users.password',
        'sys_users.contact_number',
        'sys_users.primary_address',
        'sys_users.secondary_address	',
        'sys_users.skills',
        'sys_users.date_of_birth',
        'sys_users.gender',
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
        const userDetails = await this.getUserDataFromDBByName(username);
        await this.redisService.setRedis(
          userDetailskey(userDetails.id.toString()),
          JSON.stringify(userDetails),
        );
        return userDetails;
      }
      return redisUserData;
    } else {
      const userDetails = await this.getUserDataFromDBByName(username);
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
  async checkUniqueUserName(username: string) {
    const userData = await this.findOneByName(username);
    return userData ? true : false;
  }
  //find by User Id
  async getUserDataFromDBById(userId: number) {
    const userData = await this.knex('sys_users')
      .select(
        'sys_users.id',
        'sys_users.usercode',
        'sys_users.username',
        'sys_users.email',
        'sys_users.password',
        'sys_users.contact_number',
        'sys_users.primary_address',
        'sys_users.secondary_address	',
        'sys_users.skills',
        'sys_users.date_of_birth',
        'sys_users.gender',
        'sys_users.user_image_id',
        'sys_users.user_role_id',
        'sys_users.user_status',
        'sys_users.created_at',
        'sys_users.updated_at',
      )
      .first()
      .where('sys_users.id', userId)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return userData;
  }
  async findOneById(userId: number) {
    let userData = {};
    try {
      userData = JSON.parse(
        await this.redisService.getRedis(userDetailskey(userId.toString())),
      );
      if (userData === undefined || userData === null) {
        userData = await this.getUserDataFromDBById(userId);
        if (userData === undefined || userData === null) {
          return {
            message: 'Data Not Found',
            data: {},
          };
        }
        await this.redisService.setRedis(
          userDetailskey(userId.toString()),
          JSON.stringify(userData),
        );
      }
      return userData;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
  // find all user data
  async findAll() {
    const userData = await this.knex('sys_users')
      .select(
        'sys_users.id',
        'sys_users.usercode',
        'sys_users.username',
        'sys_users.email',
        'sys_users.password',
        'sys_users.contact_number',
        'sys_users.primary_address',
        'sys_users.secondary_address	',
        'sys_users.skills',
        'sys_users.date_of_birth',
        'sys_users.gender',
        'sys_users.user_image_id',
        'sys_users.user_role_id',
        'sys_users.user_status',
        'sys_users.created_at',
        'sys_users.updated_at',
      )
      .orderBy('sys_users.id', 'DESC')
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return userData;
  }
  //update user
  async update(userId: number, updateUserDto: UpdateUserDto) {
    const userDetails = {
      ...updateUserDto,
      updated_at: await this.helperService.cmnDatetime(),
      date_of_birth: await this.helperService.cmnDatetime(
        updateUserDto.date_of_birth,
      ),
    };
    const success = await this.knex('sys_users')
      .update(userDetails)
      .where('sys_users.id', userId)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (success === undefined || success === 0) {
      throw new NotFoundException('Data Not Found');
    }
    await this.redisService.updateRedis(
      userDetailskey(userId.toString()),
      JSON.stringify(userDetails),
    );
    return userDetails;
  }
}
