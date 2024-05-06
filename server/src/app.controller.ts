import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request, NextFunction } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/*')
  root(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile('index.html', { root: join(__dirname, '..', 'dist') });
    } else {
      next();
    }
  }
}
