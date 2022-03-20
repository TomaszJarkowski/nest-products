import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_2_HOURS)
  showSomeInfo() {
    console.log('Some info...');
  }
}
