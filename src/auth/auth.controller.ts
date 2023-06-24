import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InsertSignUpDto, SignInDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
// @ApiBearerAuth('jwt')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Registration',
    description:
      'this signUp api is responsible for creating a user by post request. to make post request check json format properly',
  })
  @Post('signUp')
  @ApiResponse({ status: 200, description: 'Success', type: InsertSignUpDto })
  async signUp(@Body() insertSignUpDto: InsertSignUpDto) {
    const userdata = await this.authService.signUp(insertSignUpDto);
    return userdata;
  }

  @ApiOperation({
    summary: 'User Sign In',
    description:
      'this signIn api is responsible for creating a user by post request. to make post request check json format properly',
  })
  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({
    summary: 'Check unique username',
    description:
      'this checkUniqueUserName api is responsible for ensuring Username Uniqueness by get request.',
  })
  @Get('checkuniqueuser/:username')
  async checkUniqueUserName(@Param('username') username: string) {
    const user = await this.authService.checkUniqueUserName(username);
    return { message: 'Check Uniqueness', data: user };
  }
}
