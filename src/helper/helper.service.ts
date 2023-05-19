import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class HelperService {
  async cmnDatetime(date = null) {
    if (date) {
      return moment(date).format('YYYY-MM-DD hh:mm:ss');
    } else {
      return moment().format('YYYY-MM-DD hh:mm:ss');
    }
  }
}
