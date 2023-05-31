import { Module } from '@nestjs/common';
import { KnexerrorService } from './knex-error.service';

@Module({
  providers: [KnexerrorService],
  exports: [KnexerrorService],
})
export class KnexErrorModule {}
