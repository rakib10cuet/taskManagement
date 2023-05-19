import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AuthModule, UsersModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
