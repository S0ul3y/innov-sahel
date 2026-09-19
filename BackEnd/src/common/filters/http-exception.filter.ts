import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HttpExceptionFilter — formatte toutes les erreurs HTTP en réponse JSON cohérente.
 *
 * Format de réponse standard :
 * {
 *   statusCode: 400,
 *   message: "Validation failed",
 *   error: "Bad Request",
 *   timestamp: "2025-01-01T00:00:00.000Z",
 *   path: "/api/users"
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse;

    const errorBody = {
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error: (exceptionResponse as any).error || exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log les erreurs 5xx en niveau ERROR, les 4xx en niveau WARN
    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} → ${status}`, exception.stack);
    } else {
      this.logger.warn(`${request.method} ${request.url} → ${status} : ${JSON.stringify(message)}`);
    }

    response.status(status).json(errorBody);
  }
}
