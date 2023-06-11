import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksService } from './tasks.service';
import { InsertTaskDto, UpdateTaskDto } from './dto';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth('jwt')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @ApiOperation({
    summary: 'Insert Task',
    description:
      'this create api is responsible for inserting a task by post request. to make post request check json format properly',
  })
  @Post()
  @UseGuards(AuthGuard)
  async insertTask(@Body() insertTaskDto: InsertTaskDto) {
    const data = await this.tasksService.insertTask(insertTaskDto);
    return { message: 'Sucessfully Inserted Task!!!', data: data };
  }

  @ApiOperation({
    summary: 'Get One Task Details By Image Id',
    description:
      'this findOne api is responsible for retrieveing a Image details by get request.',
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') id: number) {
    const task = await this.tasksService.findOneById(+id);
    return { message: 'Successfully Retrieved Task!!!', data: task };
  }

  @ApiOperation({
    summary: 'Update Task Data',
    description:
      'this update api is responsible for updating Task by patch request.',
  })
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() payload: UpdateTaskDto) {
    const user = await this.tasksService.update(+id, payload);
    return { message: 'Successfully Updated Task!!!', data: user };
  }
}
