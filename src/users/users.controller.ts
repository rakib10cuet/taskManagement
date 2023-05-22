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
import { InsertSignUpDto } from 'src/auth/dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    const user = await this.usersService.findAll(limit, offset);
    return user;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOneById(+id);
    return { message: 'Successfully User Retrieve!!!', data: user };
  }

  @Post()
  async create(@Body() insertSignUpDto: InsertSignUpDto) {
    const data = this.usersService.create(insertSignUpDto);
    return { message: (await data).message, data: (await data).data };
  }

  @Patch(':id')
  async update(@Param() id: number, @Body() payload) {
    return { id, payload };
  }
}
