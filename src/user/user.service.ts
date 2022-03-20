import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { DEFAULT_ROLE } from './user.constant';
import { hashPwd } from 'src/utils/hash-pwd';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      return users;
    } catch (error) {
      throw new HttpException(
        `An error occured while getting users. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsersWithProducts(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        relations: ['products'],
      });

      return users;
    } catch (error) {
      throw new HttpException(
        `An error occured while getting users with products. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create({
        email: createUserDto.email,
        pwdHash: hashPwd(createUserDto.pwd),
        role: DEFAULT_ROLE,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          `User with email ${createUserDto.email} already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        `An error occured while creating user. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }

    return user;
  }

  async deleteUser(id: string, user: User): Promise<DeleteResult> {
    try {
      if (id !== user.id) {
        throw new Error('The user cannot delete another user');
      }

      const deleteResult = await this.userRepository.delete({ id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`User with id: ${id} not found.`);
      }

      return deleteResult;
    } catch (error) {
      throw new HttpException(
        `An error occured while deleting user. Message: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
