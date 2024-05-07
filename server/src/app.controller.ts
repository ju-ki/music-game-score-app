import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/*')
  root(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): void {
    console.log(join(__dirname, '../../', 'client', 'dist', 'index.html'));
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(join(__dirname, '../../', 'client', 'dist', 'index.html'));
    } else {
      next();
    }
  }
}
