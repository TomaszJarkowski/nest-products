import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthLoginDto, AuthLoginByFacebookDto } from './dto/auth-login.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { Authorize } from 'src/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
  ): Promise<unknown> {
    return this.authService.login(req, res);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<unknown> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @Req() req: { user: AuthLoginByFacebookDto },
    @Res() res: Response,
  ): Promise<unknown> {
    return this.authService.facebookLogin(req, res);
  }

  @Get('logout')
  @Authorize()
  async logout(@UserObj() user: User, @Res() res: Response): Promise<unknown> {
    return this.authService.logout(user, res);
  }
}
