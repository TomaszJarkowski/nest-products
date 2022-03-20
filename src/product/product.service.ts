import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { PHOTOS_STORAGE_FOLDER } from './product.constants';
import { getDefaultProperties } from './../properties/properties.utils';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Properties } from 'src/properties/properties.entity';
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { addedNewProduct } from 'src/templates/email/added-new-product';
import { storageDir } from 'src/utils/storage';
import { IMulterDiskUploadedFiles } from './interfaces/files';
import { IProduct, IProductsPaginationResponse } from './interfaces/product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(MailService)
    private mailService: MailService,
    @InjectRepository(Properties)
    private propertiesRepository: Repository<Properties>,
  ) {}

  private async sendMail(email: string) {
    try {
      await this.mailService.sendMail(
        email,
        'Dziękujemy za dodanie nowego produktu',
        addedNewProduct(),
      );
    } catch (e) {
      console.error(e);
    }
  }

  private async deletePhotoFromStorageByProductId(id: string) {
    try {
      const product = await this.productRepository.findOne(id);

      if (product.photoFn) {
        fs.unlinkSync(
          path.join(storageDir(), PHOTOS_STORAGE_FOLDER, product.photoFn),
        );
      }
    } catch (error) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }
  }

  private async deletePhotoFromStorageByNamePhoto(name: string) {
    fs.unlinkSync(path.join(storageDir(), PHOTOS_STORAGE_FOLDER, name));
  }

  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find();
      return products;
    } catch (error) {
      throw new HttpException(
        `An error occured while getting products list. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProductsV2(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        relations: ['createdBy'],
      });

      return products;
    } catch (error) {
      throw new HttpException(
        `An error occured while getting products list. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProductsPage(
    page: number = 1,
  ): Promise<IProductsPaginationResponse> {
    try {
      const maxPerPage = 10;
      const currentPage = page;

      const [products, count] = await this.productRepository.findAndCount({
        skip: maxPerPage * (currentPage - 1),
        take: maxPerPage,
      });

      const totalPages = Math.ceil(count / maxPerPage);

      return {
        products,
        pageCount: totalPages,
        currentPage,
      };
    } catch (error) {
      throw new HttpException(
        `An error occured while getting products page. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOneOrFail({
        where: {
          id,
        },
      });

      return product;
    } catch (error) {
      throw new HttpException(
        `An error occured while getting product by id. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProduct(
    product: CreateProductDto,
    user: User,
  ): Promise<IProduct> {
    try {
      const createdProduct = this.productRepository.create(product);
      const properties = await this.propertiesRepository.save(
        getDefaultProperties(),
      );
      createdProduct.properties = properties;
      createdProduct.createdBy = user;

      const response = await this.productRepository.save(createdProduct);

      await this.sendMail(user.email);

      return response;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `Product with name ${product.name} already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        `An error occured while creating product. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProduct(
    id: string,
    product: UpdateProductDto,
  ): Promise<UpdateResult> {
    try {
      const updateResult = await this.productRepository.update(id, product);

      if (updateResult.affected === 0) {
        throw new NotFoundException(`User with id: ${id} not found.`);
      }

      return updateResult;
    } catch (error) {
      throw new HttpException(
        `An error occured while updating product. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeProduct(id: string): Promise<DeleteResult> {
    try {
      await this.deletePhotoFromStorageByProductId(id);

      const deleteResult = await this.productRepository.delete(id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`User with id: ${id} not found.`);
      }

      return deleteResult;
    } catch (error) {
      throw new HttpException(
        `An error occured while deleting product. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findProducts(searchTerm: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.find({
        where: {
          name: Like(`%${searchTerm}%`),
        },
      });

      return products;
    } catch (error) {
      throw new HttpException(
        `An error occured while finding products by name. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addPhoto(
    id: string,
    files: IMulterDiskUploadedFiles,
  ): Promise<UpdateResult> {
    const photo = files?.photo?.[0] ?? null;

    try {
      await this.deletePhotoFromStorageByProductId(id);

      const product = await this.productRepository.update(id, {
        photoFn: photo.filename,
      });

      return product;
    } catch (e) {
      try {
        if (photo) {
          await this.deletePhotoFromStorageByNamePhoto(photo.filename);
        } else {
          await this.productRepository.update(id, {
            photoFn: null,
          });
        }

        throw e;
      } catch (error) {
        throw new HttpException(
          `An error occured while finding products by name. Message: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async getPhoto(id: string, res: Response): Promise<void> {
    try {
      const user = await this.productRepository.findOne(id);

      if (!user) {
        throw new Error(`User with id: ${id} not found.`);
      }

      if (!user.photoFn) {
        throw new Error(`User with id: ${id} don't have a photo`);
      }

      res.sendFile(user.photoFn, {
        root: path.join(storageDir(), PHOTOS_STORAGE_FOLDER),
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
