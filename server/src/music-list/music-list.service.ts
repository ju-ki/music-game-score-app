import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MusicListService {
  constructor(private prisma: PrismaService) {}
  async getMusicList(param) {
    console.log(param);
  }

  async createMusicList(request) {
    console.log('createMusicList');
    const newMusicList = await this.prisma.musicList.create({
      data: {
        name: request.name,
        userId: request.userId,
      },
    });

    return newMusicList;
  }
}
