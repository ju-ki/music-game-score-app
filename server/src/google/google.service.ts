import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserService } from 'user/user.service';

@Injectable()
export class GoogleService {
  constructor(private userService: UserService) {}
  async googleLogin(req) {
    if (!req.user) {
      throw new BadRequestException('User Not Found');
    }

    let user = await this.userService.findUser(req.user);

    if (!user) {
      user = await this.userService.registerUser(req.user);
    }

    // const profile = await this.getProfile(req.user.accessToken);

    const isExpired = await this.isTokenExpired(req.user.accessToken);
    console.log(isExpired);

    return {
      token: req.user.accessToken,
    };
  }

  async getProfile(token: string) {
    try {
      return axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }
}
