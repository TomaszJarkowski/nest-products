import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Product } from 'src/product/entities/product.entity';
import { Role } from 'src/roles/roles.enum';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
    default: null,
  })
  @Exclude()
  pwdHash?: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  @Exclude()
  providerId?: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  @Exclude()
  currentTokenId: string | null;

  @Column()
  role: Role;

  @OneToMany(() => Product, (entity) => entity.createdBy)
  products: Product[];
}
