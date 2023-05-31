import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/redis/redis.module';
import { HelperModule } from 'src/helper/helper.module';
import { KnexErrorModule } from 'src/knex-error/knex-error.module';

@Module({
  imports: [RedisModule, HelperModule, KnexErrorModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
