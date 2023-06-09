import { Optional } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @Optional()
  @IsString()
  username: string;

  @ApiProperty()
  @Optional()
  @IsEmail()
  password: string;
}
