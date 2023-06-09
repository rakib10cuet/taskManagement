import { Module } from '@nestjs/common';
import { DropdownsService } from './dropdowns.service';
import { DropdownsController } from './dropdowns.controller';
import { HelperModule } from 'src/helper/helper.module';
import { KnexErrorModule } from 'src/knex-error/knex-error.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, HelperModule, KnexErrorModule],
  providers: [DropdownsService],
  controllers: [DropdownsController],
})
export class DropdownsModule {}
