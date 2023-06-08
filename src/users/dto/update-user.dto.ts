import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './index';
import { Optional } from '@nestjs/common';
import { IsDate, IsInt } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Optional()
  @IsDate()
  updated_at: Date;

  @Optional()
  @IsInt()
  updated_by: number;
}
