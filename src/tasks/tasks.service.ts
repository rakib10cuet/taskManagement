import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { HelperService } from 'src/helper/helper.service';
import { InsertTaskDto, UpdateTaskDto } from './dto';
import { KnexerrorService } from 'src/knex-error/knex-error.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private knexErrorService: KnexerrorService,
    private helperService: HelperService,
  ) {}
  // insert task
  async insertTask(insertTaskDto: InsertTaskDto) {
    try {
      const startDateTime = moment(insertTaskDto.predictable_start_time);
      const endDateTime = moment(insertTaskDto.predictable_end_time);
      const duration = moment.duration(endDateTime.diff(startDateTime));
      const hours = duration.asHours();

      const payload = {
        user_id: insertTaskDto.user_id,
        task_code: insertTaskDto.task_code,
        task_name: insertTaskDto.task_name,
        sub_task: insertTaskDto.sub_task,
        predictable_start_time: insertTaskDto.predictable_start_time,
        predictable_end_time: insertTaskDto.predictable_end_time,
        predictable_estimate_hr: hours,
        task_status: insertTaskDto.task_status,
        status: 1,
        created_at: await this.helperService.cmnDatetime(),
      };
      const taskId = await this.knex
        .table('sys_tasks')
        .insert(payload, 'sys_task_id')
        .then(async function (taskId) {
          return taskId;
        })
        .catch((error) => this.knexErrorService.errorMessage(error.message));

      payload['sys_task_id'] = taskId[0];
      payload['predictable_estimate_hr'] = hours;
      return payload;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //find by Image Id
  async findOneById(taskId: number) {
    const taskData = await this.knex('sys_tasks')
      .select(
        'sys_tasks.sys_task_id',
        'sys_tasks.user_id',
        'sys_tasks.task_code',
        'sys_tasks.task_name',
        'sys_tasks.sub_task',
        'sys_tasks.predictable_start_time',
        'sys_tasks.predictable_end_time',
        'sys_tasks.actual_start_time',
        'sys_tasks.actual_end_time',
        'sys_tasks.task_status',
        'engin_configs.config_value AS task_status_name',
        'sys_tasks.created_at',
        'sys_tasks.updated_at',
        this.knex.raw(
          'ROUND(`sys_tasks`.`predictable_estimate_hr`, 2) AS `predictable_estimate_hr`, ROUND(`sys_tasks`.`actual_needed_hr`, 2) AS `actual_needed_hr`',
        ),
      )
      .innerJoin('engin_configs', function () {
        this.on('engin_configs.config_key', '=', 'sys_tasks.task_status').on(
          'engin_configs.config_slug',
          '=',
          `config_slug`,
        );
      })
      .first()
      .where('sys_tasks.sys_task_id', taskId)
      .where('sys_tasks.status', 1)
      .catch((error) => this.knexErrorService.errorMessage(error.message));
    if (
      taskData.task_status === 'complete' &&
      taskData.predictable_estimate_hr &&
      taskData.actual_needed_hr
    ) {
      const diff =
        parseFloat(taskData.actual_needed_hr) -
        parseFloat(taskData.predictable_estimate_hr);
      taskData['task_performance'] = diff ? 'Good' : 'Bad';
    }
    return taskData;
  }

  //update user
  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    if (
      updateTaskDto.predictable_start_time &&
      updateTaskDto.predictable_end_time
    ) {
      const predictableStartDateTime = moment(
        updateTaskDto.predictable_start_time,
      );
      const predictableEndDateTime = moment(updateTaskDto.predictable_end_time);
      const predictableDuration = moment.duration(
        predictableEndDateTime.diff(predictableStartDateTime),
      );
      updateTaskDto.predictable_estimate_hr = predictableDuration.asHours();
    }
    if (updateTaskDto.actual_start_time && updateTaskDto.actual_end_time) {
      const actualStartDateTime = moment(updateTaskDto.actual_start_time);
      const actualEndDateTime = moment(updateTaskDto.actual_end_time);

      const actualDuration = moment.duration(
        actualEndDateTime.diff(actualStartDateTime),
      );
      updateTaskDto.actual_needed_hr = actualDuration.asHours();
    }

    const taskDetails = {
      ...updateTaskDto,
      updated_at: await this.helperService.cmnDatetime(),
    };
    const success = await this.knex('sys_tasks')
      .update(taskDetails)
      .where('sys_tasks.sys_task_id', taskId)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (success === undefined || success === 0) {
      throw new NotFoundException('Data Not Found');
    }
    return taskDetails;
  }
}
