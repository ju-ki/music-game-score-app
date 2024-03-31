import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async registerUser(request) {
    const user = await this.prisma.user.create({
      data: {
        name: request.lastName + request.firstName,
        imageUrl: request.picture,
        email: request.email,
      },
    });

    return user;
  }

  async findUser(param) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: param.email,
      },
    });

    return user;
  }
}
