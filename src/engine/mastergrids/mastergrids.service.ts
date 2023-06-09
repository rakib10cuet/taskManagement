import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
import { KnexerrorService } from 'src/knex-error/knex-error.service';
import { masterGridDataBySlug } from 'src/redis-keys';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MastergridsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private knexErrorService: KnexerrorService,
    private helperService: HelperService,
  ) {}
  //find by Slug
  async preparedMasterGridSql(masterGridData: any) {
    const prepared_sql = `${masterGridData.select_sql}  ${masterGridData.from_sql} ${masterGridData.condition_sql} ${masterGridData.group_sql}  ${masterGridData.order_sql}`;
    return prepared_sql;
  }
  async findOneBySlug(slug: string) {
    try {
      let preparedmasterGridData = JSON.parse(
        await this.redisService.getRedis(masterGridDataBySlug(slug)),
      );
      if (
        preparedmasterGridData === undefined ||
        preparedmasterGridData === null
      ) {
        preparedmasterGridData = await this.knex('engine_dropdowns')
          .select(
            'engine_dropdowns.engine_dropdown_id',
            'engine_dropdowns.dropdown_slug',
            'engine_dropdowns.slug_details',
            'engine_dropdowns.select_sql',
            'engine_dropdowns.from_sql',
            'engine_dropdowns.condition_sql',
            'engine_dropdowns.group_sql',
            'engine_dropdowns.order_sql	',
            'engine_dropdowns.table_name',
            'engine_dropdowns.dropdown_key',
            'engine_dropdowns.dropdown_value',
            'engine_dropdowns.search_column_name',
            'engine_dropdowns.created_by',
            'engine_dropdowns.created_at',
          )
          .first()
          .where('engine_dropdowns.dropdown_slug', slug)
          .where('engine_dropdowns.status', 1)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        if (preparedmasterGridData) {
          await this.redisService.setRedis(
            masterGridDataBySlug(slug),
            JSON.stringify(preparedmasterGridData),
          );
        }
      }
      if (preparedmasterGridData) {
        const prepared_sql = await this.preparedMasterGridSql(
          preparedmasterGridData,
        );
        const masterGridData = await this.knex
          .raw(`${prepared_sql}`)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        const retrieveData = [];
        const keyColumn = preparedmasterGridData.dropdown_key;
        const valueColumn = preparedmasterGridData.dropdown_value;
        masterGridData[0].map((item) => {
          retrieveData.push({
            key: item[keyColumn],
            value: item[valueColumn],
          });
        });
        return retrieveData;
      } else {
        throw new NotFoundException('Data Not Found');
      }
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
