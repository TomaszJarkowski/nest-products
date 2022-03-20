import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ProductStatus } from './../../product-status/product-status.enum';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
