import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { getMyListDetailType, postMusicListType } from './dto';

@Injectable()
export class MusicListService {
  constructor(private prisma: PrismaService) {}
  async getMusicList(param) {
    let genreId = param.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }
    const myMusicLists = await this.prisma.musicList.findMany({
      where: {
        userId: param.userId,
        genreId: genreId,
      },
      include: {
        musics: {
          include: {
            music: true,
          },
        },
      },
    });

    return myMusicLists;
  }

  async createMusicList(request: postMusicListType) {
    let genreId = request.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }
    const newMusicList = await this.prisma.musicList.create({
      data: {
        userId: request.userId,
        name: request.myListName,
        genreId: genreId,
      },
    });

    await this.prisma.musicMusicList.createMany({
      data: request.selectedMusic.map((musicId) => {
        if (typeof musicId !== 'number') {
          musicId = parseInt(musicId);
        }
        return {
          musicId: musicId,
          musicGenreId: genreId,
          musicListId: newMusicList.id,
        };
      }),
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

  async getMusicFromList(request: getMyListDetailType) {
    let genreId = request.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }

    const music = await this.prisma.musicList.findFirst({
      where: {
        id: request.myListId,
        userId: request.userId,
        genreId: genreId,
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
