import { Optional } from '@nestjs/common';
import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InsertTaskDto {
  @Optional()
  @IsInt()
  sys_task_id: number;

  @ApiProperty()
  @Optional()
  @IsNumber()
  user_id: number;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  task_code: string;

  @ApiProperty()
  @Optional()
  @IsString()
  task_name: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  sub_task: string;

  @ApiProperty()
  @Optional()
  @IsDate()
  predictable_start_time: Date;

  @ApiPropertyOptional()
  @Optional()
  @IsDate()
  predictable_end_time: Date;

  @ApiPropertyOptional()
  @Optional()
  @IsDate()
  actual_start_time: Date;

  @ApiPropertyOptional()
  @Optional()
  @IsDate()
  actual_end_time: Date;

  @ApiPropertyOptional()
  @Optional()
  @IsNumber()
  predictable_estimate_hr: number;

  @ApiPropertyOptional()
  @Optional()
  @IsNumber()
  actual_needed_hr: number;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  task_status: string;

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
