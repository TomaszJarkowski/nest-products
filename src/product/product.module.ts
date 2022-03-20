import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { Product } from './entities/product.entity';
import { Properties } from 'src/properties/properties.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Properties, User]),
    forwardRef(() => MailModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
