import { Optional } from '@nestjs/common';
import { IsDate, IsEmail, IsInt, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @Optional()
  @IsInt()
  sys_user_id: number;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  usercode: string;

  @ApiProperty()
  @Optional()
  @IsString()
  username: string;

  @ApiProperty()
  @Optional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Optional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  user_details: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  contact_number: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  primary_address: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  secondary_address: string;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  skills: string;

  @ApiPropertyOptional()
  @Optional()
  @IsDate()
  date_of_birth: Date;

  @ApiPropertyOptional()
  @Optional()
  @IsString()
  gender: string;

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
