import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Properties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
  })
  color: string;

  @Column({
    length: 20,
  })
  size: string;

  @Column({
    length: 20,
  })
  material: string;

  @OneToOne(() => Product, (product) => product.properties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}
