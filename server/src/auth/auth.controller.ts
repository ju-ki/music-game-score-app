import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { config } from 'dotenv';
import { Response, Request } from 'express';
config();
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  async googleAuthRedirect() {}

  @Get('verify')
  async verifyUser(@Req() request: Request, @Query() query): Promise<boolean> {
    const accessToken = request.headers?.authorization?.split(' ')[1];
    const refreshToken = request.cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      throw new HttpException('Access Token Or Refresh Token Not Found', HttpStatus.BAD_REQUEST);
    }
    const userId = query.userId;

    const isValid = await this.authService.verifyToken(accessToken, refreshToken, userId);

    return isValid;
  }

  @Post('/google/login')
  async googleLogin(@Body('code') code: string, @Res() res: Response): Promise<any> {
    if (!code) {
      throw new HttpException('Custom Invalid Request', HttpStatus.BAD_REQUEST);
    }

    try {
      const { user, accessToken, refreshToken } = await this.authService.exchangeCodeForToken(code);
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost',
      });
      res.json({
        user,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to exchange code for token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
