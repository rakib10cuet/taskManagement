import { Module } from '@nestjs/common';
import { MastergridsController } from './mastergrids.controller';
import { MastergridsService } from './mastergrids.service';
import { HelperModule } from 'src/helper/helper.module';
import { KnexErrorModule } from 'src/knex-error/knex-error.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, HelperModule, KnexErrorModule],
  controllers: [MastergridsController],
  providers: [MastergridsService],
})
export class MastergridsModule {}
