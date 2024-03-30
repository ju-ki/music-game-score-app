import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    // この時点でreq.userに上のほうで定義したvalidateで抜き出した認証情報が入っている(名前、メールアドレス、画像など)
    // 具体的な処理はserviceにやらせる
    return this.googleService.googleLogin(req);
  }
}
