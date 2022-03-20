import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from './product/product.module';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';
import { getTypeOrmConfig } from './app.utils';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ProductModule,
    CronModule,
    MailModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
