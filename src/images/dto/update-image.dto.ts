import { PartialType } from '@nestjs/mapped-types';
import { Optional } from '@nestjs/common';
import { IsDate, IsInt } from 'class-validator';
import { InsertImageDto } from './index';

export class UpdateImageDto extends PartialType(InsertImageDto) {
  @Optional()
  @IsDate()
  updated_at: Date;

  @Optional()
  @IsInt()
  updated_by: number;
}
