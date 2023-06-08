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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.create(createUserDto);
    return { message: (await data).message, data: (await data).data };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOneById(+id);
    return { message: 'Successfully Retrieved User!!!', data: user };
  }

  @Get('checkuniqueuser/:username')
  async checkUniqueUserName(@Param('username') username: string) {
    const user = await this.usersService.checkUniqueUserName(username);
    return { message: 'Check Uniqueness', data: user };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() payload: UpdateUserDto) {
    const user = await this.usersService.update(+id, payload);
    return { message: 'Successfully Updated User!!!', data: user };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    const user = await this.usersService.findAll();
    return { message: 'Retrieve All Users!!!', data: user };
  }
}
