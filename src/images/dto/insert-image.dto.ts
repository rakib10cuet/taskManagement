import { Optional } from '@nestjs/common';
import { IsDate, IsEmail, IsInt, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InsertImageDto {
  @Optional()
  @IsInt()
  sys_image_id: number;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  image_code: string;

  @ApiProperty()
  @Optional()
  @IsString()
  image_name: string;

  @ApiProperty()
  @Optional()
  @IsEmail()
  image_description: string;

  @Optional()
  @IsDate()
  created_at: Date;

  @Optional()
  @IsInt()
  created_by: number;

  @Optional()
  @IsInt()
  status: number;
}
