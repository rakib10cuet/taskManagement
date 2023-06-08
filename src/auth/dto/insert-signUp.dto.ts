import { Optional } from '@nestjs/common';
import { IsDate, IsEmail, IsInt, IsString } from 'class-validator';

export class InsertSignUpDto {
  @Optional()
  @IsInt()
  id: number;

  @Optional()
  @IsString()
  usercode: string;

  @Optional()
  @IsString()
  username: string;

  @Optional()
  @IsEmail()
  email: string;

  @Optional()
  @IsString()
  password: string;

  @Optional()
  @IsString()
  user_details: string;

  @Optional()
  @IsString()
  contact_number: string;

  @Optional()
  @IsString()
  primary_address: string;

  @Optional()
  @IsString()
  secondary_address: string;

  @Optional()
  @IsString()
  skills: string;

  @Optional()
  @IsDate()
  date_of_birth: Date;

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
