import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * LoggingInterceptor — trace chaque requête entrant et sortant.
 * Utile pour le journal d'administration requis par le cahier des charges (§10.3).
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const userInfo = user ? `[${user.role}:${user.email}]` : '[public]';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(`${method} ${url} ${userInfo} — ${ms}ms`);
      }),
    );
  }
}
