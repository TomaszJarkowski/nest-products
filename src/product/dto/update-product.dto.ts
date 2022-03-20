import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { ProductStatus } from './../../product-status/product-status.enum';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: ProductStatus;
}
