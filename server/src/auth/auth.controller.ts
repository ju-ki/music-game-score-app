import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { config } from 'dotenv';
// import { OAuth2Client } from 'google-auth-library';
config();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  async googleAuthRedirect() {}

  @Post('/google/login')
  async googleLogin(@Body('code') code: string): Promise<any> {
    if (!code) {
      throw new HttpException('Custom Invalid Request', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.authService.exchangeCodeForToken(code);
      // ここで得たトークンを使ってユーザー情報を取得するなどの追加処理を行う
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to exchange code for token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
