import {
  CallHandler,
  ExecutionContext,
  HttpException,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import type { Level } from 'pino';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import logger from '~/logger';

export class RestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const params = {
      method: request.method,
      url: request.url,
      body: request.body,
    };

    logger.debug(params, `Request started`);
    const startedAt = process.hrtime.bigint();

    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          const status = err.getStatus();
          const level: Level =
            500 <= status && status <= 599 ? 'error' : 'debug';
          logger[level](
            { ...params, duration: this.fromStarted(startedAt), err },
            `Request finished with error`,
          );
          return throwError(() => err);
        }
        logger.error(
          { ...params, duration: this.fromStarted(startedAt), err },
          `Request finished with error`,
        );
        return throwError(() => new InternalServerErrorException(err.message));
      }),
      tap(() => {
        logger.debug(
          { ...params, duration: this.fromStarted(startedAt) },
          `Request finished`,
        );
      }),
    );
  }

  private fromStarted(startedAt: bigint): number {
    return (
      parseFloat((process.hrtime.bigint() - startedAt).toString()) / 10 ** 9
    );
  }
}
