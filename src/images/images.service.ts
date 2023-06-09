import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
import { RedisService } from 'src/redis/redis.service';
import { InsertImageDto } from './dto';
import { KnexerrorService } from 'src/knex-error/knex-error.service';
import {
  imageDetailskey,
  imageIdByNamekey,
  imageNameByIdkey,
} from 'src/redis-keys';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private redisService: RedisService,
    private knexErrorService: KnexerrorService,
    private helperService: HelperService,
  ) {}
  // insert image
  async insertImage(insertSignUpDto: InsertImageDto) {
    try {
      const payload = {
        image_code: '',
        image_name: insertSignUpDto.image_name,
        image_description: insertSignUpDto.image_description,
        status: 1,
        created_at: await this.helperService.cmnDatetime(),
      };
      const imageId = await this.knex
        .table('sys_images')
        .insert(payload, 'sys_image_id')
        .then(async function (imageId) {
          return imageId;
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      payload['sys_image_id'] = imageId[0];
      console.log('insertSignUpDto', insertSignUpDto);
      //store Image Name
      await this.redisService.setRedis(
        imageNameByIdkey(imageId[0].toString()),
        payload.image_name,
      );
      //store Image Id
      await this.redisService.setRedis(
        imageIdByNamekey(payload.image_name),
        imageId[0].toString(),
      );
      //store Image Details
      await this.redisService.setRedis(
        imageDetailskey(imageId[0].toString()),
        JSON.stringify(payload),
      );
      return payload;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //find by Image Id
  async getImageDataFromDBById(imageId: number) {
    const imageData = await this.knex('sys_images')
      .select(
        'sys_images.sys_image_id',
        'sys_images.image_code',
        'sys_images.image_name',
        'sys_images.image_description',
        'sys_images.created_at',
        'sys_images.updated_at',
      )
      .first()
      .where('sys_images.sys_image_id', imageId)
      .where('sys_images.status', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    return imageData;
  }
  async findOneById(imageId: number) {
    let imageData = {};
    try {
      imageData = JSON.parse(
        await this.redisService.getRedis(imageDetailskey(imageId.toString())),
      );
      if (imageData === undefined || imageData === null) {
        imageData = await this.getImageDataFromDBById(imageId);
        if (imageData === undefined || imageData === null) {
          return {
            message: 'Data Not Found',
            data: {},
          };
        }
        await this.redisService.setRedis(
          imageDetailskey(imageId.toString()),
          JSON.stringify(imageData),
        );
      }
      return imageData;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }
}
