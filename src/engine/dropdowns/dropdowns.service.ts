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
  //find by Slug
  async preparedDropdownSql(dropDownData: any) {
    const prepared_sql = `${dropDownData.select_sql}  ${dropDownData.from_sql} ${dropDownData.condition_sql} ${dropDownData.group_sql}  ${dropDownData.order_sql}`;
    return prepared_sql;
  }
  async findOneBySlug(slug: string) {
    try {
      let preparedDropdownData = JSON.parse(
        await this.redisService.getRedis(dropdownDataBySlug(slug)),
      );
      if (preparedDropdownData === undefined || preparedDropdownData === null) {
        preparedDropdownData = await this.knex('engine_dropdowns')
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
        if (preparedDropdownData) {
          await this.redisService.setRedis(
            dropdownDataBySlug(slug),
            JSON.stringify(preparedDropdownData),
          );
        }
      }
      if (preparedDropdownData) {
        const prepared_sql = await this.preparedDropdownSql(
          preparedDropdownData,
        );
        const dropdownData = await this.knex
          .raw(`${prepared_sql}`)
          .catch((error) => this.knexErrorService.errorMessage(error.message));
        const retrieveData = [];
        const keyColumn = preparedDropdownData.dropdown_key;
        const valueColumn = preparedDropdownData.dropdown_value;
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
}
