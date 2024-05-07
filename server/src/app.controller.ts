import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
// import { NextFunction, Request, Response } from 'express';
// import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
