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
}
