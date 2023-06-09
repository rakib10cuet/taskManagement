import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
import { KnexerrorService } from 'src/knex-error/knex-error.service';
import { dropdownDataBySlug } from 'src/redis-keys';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DropdownsService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private knexErrorService: KnexerrorService,
    private helperService: HelperService,
  ) {}
  //find by User Id
  async preparedDropdownSql(slug: string) {
    try {
      let preparedRedisData = JSON.parse(
        await this.redisService.getRedis(dropdownDataBySlug(slug)),
      );
      if (preparedRedisData === undefined || preparedRedisData === null) {
        preparedRedisData = await this.knex('engine_dropdowns')
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
        if (preparedRedisData) {
          await this.redisService.setRedis(
            dropdownDataBySlug(slug),
            JSON.stringify(preparedRedisData),
          );
        }
      }
      if (preparedRedisData) {
        const prepared_sql = `${preparedRedisData.select_sql}  ${preparedRedisData.from_sql} ${preparedRedisData.condition_sql} ${preparedRedisData.group_sql}  ${preparedRedisData.order_sql}`;
        const dropdownData = await this.knex
          .raw(`${prepared_sql}`)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        const retrieveData = [];
        const keyColumn = preparedRedisData.dropdown_key;
        const valueColumn = preparedRedisData.dropdown_value;
        dropdownData[0].map((item) => {
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
  async findOneBySlug(slug: string) {
    try {
      const dropdownData = await this.preparedDropdownSql(slug);
      //   dropdownData = JSON.parse(
      //     await this.redisService.getRedis(dropdownDataBySlug(slug)),
      //   );
      //   if (dropdownData === undefined || dropdownData === null) {
      //     dropdownData = await this.preparedDropdownSql(slug);
      //     if (dropdownData === undefined || dropdownData === null) {
      //       return {
      //         message: 'Data Not Found',
      //         data: {},
      //       };
      //     }
      //     await this.redisService.setRedis(
      //       dropdownDataBySlug(slug),
      //       JSON.stringify(dropdownData),
      //     );
      //   }
      return dropdownData;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
