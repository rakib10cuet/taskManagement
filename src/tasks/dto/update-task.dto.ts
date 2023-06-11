import { PartialType } from '@nestjs/mapped-types';
import { Optional } from '@nestjs/common';
import { IsDate, IsInt } from 'class-validator';
import { InsertTaskDto } from './index';

export class UpdateTaskDto extends PartialType(InsertTaskDto) {
  @Optional()
  @IsDate()
  updated_at: Date;

  @Optional()
  @IsInt()
  updated_by: number;
}
