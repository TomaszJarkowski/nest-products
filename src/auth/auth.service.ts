import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  getJwtExpireTime,
  getJwtSecret,
  getCookieOptions,
  getFrontendURL,
} from './auth.utils';
import { AuthLoginDto, AuthLoginByFacebookDto } from './dto/auth-login.dto';
import { User } from '../user/entities/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { JwtPayload } from './jwt.strategy';
import { Environments } from 'src/environments/environments.enum';
import { DEFAULT_ROLE } from 'src/user/user.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number | string;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = getJwtExpireTime();
    const accessToken = sign(payload, getJwtSecret(), { expiresIn });

    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token: string;
    let userWithThisToken: User = null;
    do {
      token = uuid();
      userWithThisToken = await this.userRepository.findOne({
        currentTokenId: token,
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        email: req.email,
        pwdHash: hashPwd(req.pwd),
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: 'Invalid login data!', status: 400 });
      }

      const token = this.createToken(await this.generateToken(user));

      return res
        .cookie(
          'jwt',
          token.accessToken,
          getCookieOptions(process.env.NODE_ENV ?? Environments.local),
        )
        .status(200)
        .json({ message: 'You are logged in', status: 200 });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async facebookLogin(
    req: { user: AuthLoginByFacebookDto },
    res: Response,
  ): Promise<any> {
    try {
      const requset = req.user;

      let user: User = await this.userRepository.findOne({
        email: requset.email,
        providerId: requset.id,
      });

      if (!user) {
        const userCreate = this.userRepository.create({
          email: requset.email,
          providerId: requset.id,
          role: DEFAULT_ROLE,
        });

        user = await this.userRepository.save(userCreate);
      }

      const token = this.createToken(await this.generateToken(user));

      return res
        .cookie(
          'jwt',
          token.accessToken,
          getCookieOptions(process.env.NODE_ENV ?? Environments.local),
        )
        .status(200)
        .redirect(getFrontendURL());
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie(
        'jwt',
        getCookieOptions(process.env.NODE_ENV ?? Environments.local),
      );
      return res
        .status(200)
        .json({ message: 'You are logged out', status: 200 });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
