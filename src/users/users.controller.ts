import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create User API',
    description:
      'this create api is responsible for creating a user by post request. to make post request check json format properly',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return { message: (await data).message, data: (await data).data };
  }

  @ApiOperation({
    summary: 'Get One User By User Id',
    description:
      'this findOne api is responsible for retrieveing a user by get request.',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOneById(+id);
    return { message: 'Successfully Retrieved User!!!', data: user };
  }

  @ApiOperation({
    summary: 'Check unique username',
    description:
      'this checkUniqueUserName api is responsible for ensuring Username Uniqueness by get request.',
  })
  @Get('checkuniqueuser/:username')
  async checkUniqueUserName(@Param('username') username: string) {
    const user = await this.usersService.checkUniqueUserName(username);
    return { message: 'Check Uniqueness', data: user };
  }

  @ApiOperation({
    summary: 'Check unique username',
    description:
      'this checkUniqueUserName api is responsible for ensuring Username Uniqueness by get request.',
  })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
    const user = await this.usersService.update(+id, payload);
    return { message: 'Successfully Updated User!!!', data: user };
  }

  @ApiOperation({
    summary: 'Get All Users',
    description:
      'this findAll api is responsible for retrieveing All Users by get request.',
  })
  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    const user = await this.usersService.findAll();
    return { message: 'Retrieve All Users!!!', data: user };
  }
}
