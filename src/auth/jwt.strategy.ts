import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { getJwtSecret } from './auth.utils';
import { User } from '../user/entities/user.entity';

export interface JwtPayload {
  id: string;
}

function cookieExtractor(req: Request): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(
    payload: JwtPayload,
    done: (error, user) => void,
  ): Promise<void> {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }

    const user = await User.findOne({ currentTokenId: payload.id });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}
