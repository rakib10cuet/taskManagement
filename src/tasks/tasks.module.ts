import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { HelperModule } from 'src/helper/helper.module';
import { KnexErrorModule } from 'src/knex-error/knex-error.module';

@Module({
  imports: [HelperModule, KnexErrorModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
