import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async registerUser(request) {
    const user = await this.prisma.user.create({
      data: {
        name: request.name,
        imageUrl: request.imageUrl,
        email: request.email,
      },
    });

    return user;
  }

  async findUser(email) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async getUserList() {
    const userList = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        email: true,
        authority: true,
      },
    });
    return userList;
  }

  async changeAuthority(request) {
    request.users.map(async (user) => {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          authority: user.authority,
        },
      });
    });
    const userList = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        email: true,
        authority: true,
      },
    });
    return userList;
  }
}
