import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class MyTimeoutInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      timeout(5000),
      catchError((error): any => {
        if (error instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }

        return throwError(error);
      }),
    );
  }
}
