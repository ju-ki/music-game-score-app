import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { config } from 'dotenv';
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
  async verifyUser(@Req() request, @Query() query): Promise<boolean> {
    const accessToken = request.headers?.authorization?.split(' ')[1];
    if (!accessToken) {
      return false;
    }
    const userId = query.userId;

    const isValid = await this.authService.verifyToken(accessToken, userId);

    return isValid;
  }

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
      console.error(error);
      throw new HttpException('Failed to exchange code for token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
