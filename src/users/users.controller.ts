import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return { a: 'send all data', limit, offset };
  }

  @Get(':id')
  //   @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    console.log('ssssshere', id);
    const user = await this.usersService.findOneById(id);
    return user;
  }

  @Post()
  async create(@Body() payload) {
    return { ...payload, time: 1 };
  }

  @Patch(':id')
  async update(@Param() id: number, @Body() payload) {
    return { id, payload };
  }
}
