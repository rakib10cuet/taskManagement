import {
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class KnexerrorService {
  private logger: Logger;
  errorMessage(message: string) {
    this.logger = new Logger('KnexErrorService');
    if (!message) {
      this.logger.log(`${HttpStatus.NOT_FOUND} - Connection Error!`);
      throw new NotFoundException('Connection Error!');
    }

    const split_message = message.split(' - ');
    console.log(split_message);
    if (!split_message[1]) {
      if (split_message.includes('connect ETIMEDOUT')) {
        this.logger.log(`${HttpStatus.GATEWAY_TIMEOUT} - Connection Timedout!`);
        throw new GatewayTimeoutException();
      }
      this.logger.log(`${HttpStatus.BAD_GATEWAY} - Connection Error!`);
      throw new HttpException('Connection Error!', HttpStatus.BAD_GATEWAY);
    }
    //remove db name from the error messages
    const db_name = (process.env.database || 'fin_erp').concat('.');
    this.logger.log(
      `${HttpStatus.BAD_GATEWAY} - ${
        db_name ? split_message[1].replace(db_name, '') : split_message[1]
      }`,
    );
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: db_name
          ? split_message[1].replace(db_name, '')
          : split_message[1],
        error: true,
      },
      HttpStatus.BAD_GATEWAY,
    );
  }
}
