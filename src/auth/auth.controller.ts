import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { InsertSignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  async signUp(@Body() insertSignUpDto: InsertSignUpDto) {
    const userdata = this.authService.signUp(insertSignUpDto);
    return userdata;
  }

  @Post('signIn')
  async signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
