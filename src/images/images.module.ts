import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { HelperModule } from 'src/helper/helper.module';
import { KnexErrorModule } from 'src/knex-error/knex-error.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, HelperModule, KnexErrorModule],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
