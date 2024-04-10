import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private authService: AuthService,
  ) {}

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Request() req) {
  //   console.log(req);
  // }

  // @Get('is_login')
  // async isLogin(@Request() req) {
  //   console.log(req.cookie);
  //   // const accessToken = req.cookie['access_token'];
  //   const isLogin = await this.googleService.isTokenExpired('test');
  //   return isLogin;
  // }

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Request() req, @Response() res) {
  //   console.log(req.user);
  //   const token = await this.authService.login({ username: 'test', userId: 'testId' });
  //   res.redirect(`${process.env.TOP_URL}?token=${token.access_token}`);
  // }
}
