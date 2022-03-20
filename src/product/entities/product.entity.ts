import { ProductStatus } from './../../product-status/product-status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { IProduct } from 'src/product/interfaces/product';
import { Properties } from 'src/properties/properties.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@Unique(['name'])
export class Product implements IProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    type: 'float',
    scale: 2,
  })
  price: number;

  @Column({
    default: 'brak',
  })
  description: string;

  @Column({
    default: ProductStatus.new,
  })
  status: ProductStatus;

  @Column({
    default: null,
    nullable: true,
  })
  photoFn: string;

  @OneToOne(() => Properties, (properties) => properties.product, {
    eager: true,
  })
  properties: Properties;

  @ManyToOne(() => User, (entity) => entity.products, {
    onDelete: 'SET NULL',
  })
  createdBy: User;
}
