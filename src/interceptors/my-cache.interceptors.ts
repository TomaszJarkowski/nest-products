import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

import { CACHE_TIME_KEY } from './../decorators/use-cache-time.decorator';

export const CACHE_DATA_KEY = 'cacheData';
export const CACHE_TIMESTAMP_KEY = 'cacheTimestamp';

@Injectable()
export class MyCacheInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const method = context.getHandler();
    const cachedData = this.reflector.get<any>(CACHE_DATA_KEY, method);
    const cachedTime = this.reflector.get<Date>(CACHE_TIMESTAMP_KEY, method);
    const howLongCachedData = this.reflector.get<number>(
      CACHE_TIME_KEY,
      context.getHandler(),
    );

    if (cachedData && +cachedTime + howLongCachedData > +new Date()) {
      console.log('Using cached data');
      return of(cachedData);
    }

    return next.handle().pipe(
      tap((data) => {
        console.log('Generating live data');
        Reflect.defineMetadata(CACHE_DATA_KEY, data, method);
        Reflect.defineMetadata(CACHE_TIMESTAMP_KEY, +new Date(), method);
      }),
    );
  }
}
