import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { UserObj } from './../decorators/user-obj.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authorize } from 'src/decorators/auth.decorator';
import { Role } from 'src/roles/roles.enum';
import { User } from './entities/user.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  @Authorize(Role.admin)
  getUser() {
    return this.userService.getUsers();
  }

  @Get('/list-with-products')
  @Authorize(Role.admin)
  getUsersWithProducts() {
    return this.userService.getUsersWithProducts();
  }

  @Get('/:id')
  @Authorize(Role.admin)
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Delete('/:id')
  @Authorize()
  deleteUser(@Param('id') id: string, @UserObj() user: User) {
    return this.userService.deleteUser(id, user);
  }

  @Post('/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
