import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { KnexerrorService } from 'src/knex-error/knex-error.service';
import { masterGridDataBySlug } from 'src/redis-keys';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MastergridsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private knexErrorService: KnexerrorService,
  ) {}
  //find by Slug
  async preparedMasterGridSql(masterGridData: any) {
    const prepared_sql = `${masterGridData.select_sql}  ${masterGridData.from_sql} ${masterGridData.condition_sql} ${masterGridData.group_sql}  ${masterGridData.order_sql}`;
    return prepared_sql;
  }
  async masterGrid(slug: string) {
    try {
      let preparedmasterGridData = JSON.parse(
        await this.redisService.getRedis(masterGridDataBySlug(slug)),
      );
      if (
        preparedmasterGridData === undefined ||
        preparedmasterGridData === null
      ) {
        preparedmasterGridData = await this.knex('engine_mastergrids')
          .select(
            'engine_mastergrids.engine_master_id',
            'engine_mastergrids.master_slug',
            'engine_mastergrids.slug_details',
            'engine_mastergrids.column_title',
            'engine_mastergrids.select_sql',
            'engine_mastergrids.from_sql',
            'engine_mastergrids.condition_sql',
            'engine_mastergrids.group_sql',
            'engine_mastergrids.order_sql	',
            'engine_mastergrids.table_name',
            'engine_mastergrids.table_primary_id',
            'engine_mastergrids.table_status_id',
            'engine_mastergrids.search_column_name',
          )
          .first()
          .where('engine_mastergrids.master_slug', slug)
          .where('engine_mastergrids.status', 1)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        if (preparedmasterGridData) {
          // await this.redisService.setRedis(
          //   masterGridDataBySlug(slug),
          //   JSON.stringify(preparedmasterGridData),
          // );
        }
      }
      if (preparedmasterGridData) {
        const prepared_sql = await this.preparedMasterGridSql(
          preparedmasterGridData,
        );
        const masterGridData = await this.knex
          .raw(`${prepared_sql}`)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        return {
          grid_data: masterGridData[0],
          column_title: JSON.parse(preparedmasterGridData.column_title),
        };
      } else {
        throw new NotFoundException('Data Not Found');
      }
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
