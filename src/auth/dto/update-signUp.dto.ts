import { PartialType } from '@nestjs/mapped-types';
import { InsertSignUpDto } from './index';
import { Optional } from '@nestjs/common';
import { IsInt } from 'class-validator';

export class UpdateSignUpDto extends PartialType(InsertSignUpDto) {
  updated_at: Date;

  @Optional()
  @IsInt()
  updated_by: number;
}
