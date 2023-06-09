import { PartialType } from '@nestjs/mapped-types';
import { InsertSignUpDto } from './index';
import { Optional } from '@nestjs/common';
import { IsDate, IsInt } from 'class-validator';

export class UpdateSignUpDto extends PartialType(InsertSignUpDto) {
  @Optional()
  @IsDate()
  updated_at: Date;

  @Optional()
  @IsInt()
  updated_by: number;
}
