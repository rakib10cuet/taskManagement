import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/redis/redis.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [RedisModule, HelperModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
