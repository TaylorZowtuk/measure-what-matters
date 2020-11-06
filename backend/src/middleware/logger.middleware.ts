import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next) {
    const { ip, method, originalUrl } = req;

    res.on('close', () => {
      const { statusCode } = res;

      let username = '';
      if (req.user) {
        username = JSON.parse(JSON.stringify(req.user)).username;
      }

      Logger.log(
        `[HTTP] ${method} ${originalUrl} ${statusCode} - ${username} ${ip}`,
      );
    });
    next();
  }
}
