import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
    const userdata = this.authService.signUp(insertSignUpDto);
    return userdata;
  }

  @ApiOperation({
    summary: 'User Sign In',
    description:
      'this signIn api is responsible for creating a user by post request. to make post request check json format properly',
  })
  @Post('signIn')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
