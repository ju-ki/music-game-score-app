import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/*')
  root(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile('index.html', { root: join(__dirname, '../../', 'client/dist') });
    } else {
      next();
    }
  }
}
