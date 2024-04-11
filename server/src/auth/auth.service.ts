import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { config } from 'dotenv';
import { UserService } from 'user/user.service';
import * as qs from 'querystring';
config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login({ email, name, imageUrl }) {
    let user = await this.userService.findUser(email);
    if (!user) {
      user = await this.userService.registerUser({ name, imageUrl, email });
    }

    return user;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const params = qs.stringify({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.TOP_PAGE,
      grant_type: 'authorization_code',
    });

    let accessToken = '';
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      accessToken = response.data.access_token;
      const userinfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
      const user = await this.login({
        email: userinfo.data.email,
        name: userinfo.data.name,
        imageUrl: userinfo.data.picture,
      });
      return user; // アクセストークン、リフレッシュトークンなどを含むレスポンス
    } catch (error) {
      throw new Error('Failed to retrieve access token');
    }
  }
}
