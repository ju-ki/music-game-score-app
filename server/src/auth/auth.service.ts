import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
import { UserService } from 'user/user.service';
import * as qs from 'querystring';
import { PrismaService } from 'prisma/prisma.service';
config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async login({ email, name, imageUrl }) {
    let user = await this.userService.findUser(email);
    if (!user) {
      user = await this.userService.registerUser({ name, imageUrl, email });
    }

    return user;
  }

  async verifyToken(accessToken: string, userId: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);

      if (response.data && response.data.email) {
        return true;
      } else {
        const refreshToken = await this.getRefreshToken(userId);
        if (refreshToken) {
          const { accessToken: newAccessToken } = await this.refreshToken(refreshToken, userId);
          return await this.verifyToken(newAccessToken, userId);
        } else {
          return false;
        }
      }
    } catch (error) {
      const refreshToken = await this.getRefreshToken(userId);
      if (refreshToken) {
        const { accessToken: newAccessToken } = await this.refreshToken(refreshToken, userId);
        return await this.verifyToken(newAccessToken, userId);
      } else {
        return false;
      }
    }
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
    let refreshToken = '';
    try {
      const token = await axios.post('https://oauth2.googleapis.com/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      accessToken = token.data.access_token;
      refreshToken = token.data.refresh_token;
      const userinfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
      const user = await this.login({
        email: userinfo.data.email,
        name: userinfo.data.name,
        imageUrl: userinfo.data.picture,
      });

      const expiresAt = new Date(Date.now() + 3600 * 1000 * 24 * 30);
      await this.saveRefreshToken(user.id, refreshToken, expiresAt);

      const response = {
        ...user,
        accessToken,
        refreshToken,
      };
      return response;
    } catch (error) {
      throw new Error('Failed to retrieve access token');
    }
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        userId,
      },
    });

    if (token && new Date() < token.expiresAt) {
      return token.refreshToken;
    }

    return null;
  }

  async refreshToken(refreshToken: string, userId: string): Promise<any> {
    const params = qs.stringify({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.TOP_PAGE,
      grant_type: 'refresh_token',
    });

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token || refreshToken;
      // const userId = 'test';
      const expiresAt = new Date(Date.now() + 3600 * 1000 * 24 * 30);
      // 新しいリフレッシュトークンをストレージに保存する
      await this.saveRefreshToken(userId, newRefreshToken, expiresAt);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Failed to refresh access token');
    }
  }

  async saveRefreshToken(userId: string, refreshToken: string, expiresAt: Date) {
    await this.prisma.refreshToken.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      },
      update: {
        refreshToken: refreshToken,
      },
    });
  }
}
