import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MusicListService {
  constructor(private prisma: PrismaService) {}
  async getMusicList(param) {
    const myMusicLists = await this.prisma.musicList.findMany({
      where: {
        userId: param.userId,
        genreId: param.genreId,
      },
    });

    return myMusicLists;
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

  async removeMusicFromList(request) {
    let musicId: number = request.musicId;
    let musicGenreId: number = request.musicGenreId;
    if (typeof musicId !== 'number') {
      musicId = parseInt(musicId);
    }

    if (typeof musicGenreId !== 'number') {
      musicGenreId = parseInt(musicGenreId);
    }
    await this.prisma.musicMusicList.delete({
      where: {
        musicId_musicGenreId_musicListId: {
          musicId: musicId,
          musicGenreId: musicGenreId,
          musicListId: request.musicListId,
        },
      },
    });
    return request;
  }

  async getMusicFromList(request) {
    const music = await this.prisma.musicList.findMany({
      where: {
        id: request.musicListId,
        userId: request.userId,
      },
      include: {
        musics: {
          include: {
            music: true,
          },
        },
      },
    });

    return music;
  }
}
