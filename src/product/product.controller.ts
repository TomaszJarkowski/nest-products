import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';

import { PHOTOS_STORAGE_FOLDER } from './product.constants';
import { imageFileFilter, getMaxPhotoSize } from './product.utils';
import { User } from 'src/user/entities/user.entity';
import { UserObj } from './../decorators/user-obj.decorator';
import { UseCacheTime } from './../decorators/use-cache-time.decorator';
import { MyCacheInterceptor } from './../interceptors/my-cache.interceptors';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { multerStorage, storageDir } from 'src/utils/storage';
import { IMulterDiskUploadedFiles } from './interfaces/files';
import { Authorize } from 'src/decorators/auth.decorator';
import { Role } from 'src/roles/roles.enum';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(@Inject(ProductService) private productService: ProductService) {}

  @Get('/')
  @Authorize()
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Version('2')
  @Get('/')
  @Authorize()
  async getProductsV2() {
    return await this.productService.getProductsV2();
  }

  @Get('/page/:id')
  @Authorize()
  async getProductsPage(@Param('id', ParseIntPipe) page: number) {
    return await this.productService.getProductsPage(page);
  }

  @Get('/:id')
  @Authorize()
  @UseCacheTime(5000)
  @UseInterceptors(MyCacheInterceptor)
  async getProduct(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @Post('/')
  @Authorize(Role.admin)
  async createProduct(@UserObj() user: User, @Body() body: CreateProductDto) {
    return await this.productService.createProduct(body, user);
  }

  @Patch('/:id')
  @Authorize(Role.admin)
  async updateProducts(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, body);
  }

  @Delete('/:id')
  @Authorize(Role.admin)
  async removeProduct(@Param('id') id: string) {
    return await this.productService.removeProduct(id);
  }

  @Post('/photo/:id')
  @Authorize(Role.admin)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'photo',
          maxCount: 1,
        },
      ],
      {
        storage: multerStorage(path.join(storageDir(), PHOTOS_STORAGE_FOLDER)),
        fileFilter: imageFileFilter,
        limits: {
          fileSize: getMaxPhotoSize(),
        },
      },
    ),
  )
  async addPhoto(
    @Param('id') id: string,
    @UploadedFiles() files: IMulterDiskUploadedFiles,
  ) {
    return await this.productService.addPhoto(id, files);
  }

  @Get('/photo/:id')
  @Authorize()
  async getPhoto(@Param('id') id: string, @Res() res: Response) {
    return await this.productService.getPhoto(id, res);
  }
}
