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
        genreId: request.genreId,
        name: request.name,
        userId: request.userId,
      },
    });

    return newMusicList;
  }

  async addMusicToList(request) {
    console.log('addMusicToList');
    await this.prisma.musicMusicList.create({
      data: {
        musicId: request.musicId,
        musicListId: request.musicListId,
        musicGenreId: request.musicGenreId,
      },
    });
  }
}
