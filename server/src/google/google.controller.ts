import { Controller, Get, UseGuards, Request, Response, HttpStatus } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    console.log(req);
  }

  @Get('is_login')
  async isLogin(@Request() req) {
    const isLogin = await this.googleService.isTokenExpired(req.accessToken);
    return isLogin;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Response() res) {
    const token = await this.googleService.googleLogin(req);

    await res.cookie('access_token', token.token, {
      maxAge: 5000,
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });

    res.redirect(process.env.TOP_PAGE);
  }
}
