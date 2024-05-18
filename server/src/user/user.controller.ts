import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  async getUserList() {
    return await this.userService.getUserList();
  }

  @Patch('/change-authority')
  async changeAuthority(@Body() body) {
    console.log(body);
    return await this.userService.changeAuthority(body);
  }
}
