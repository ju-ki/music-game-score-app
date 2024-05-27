import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DeleteMyListType, addMusicToListType, getMyListDetailType, postMusicListType } from './dto';

@Injectable()
export class MusicListService {
  constructor(private prisma: PrismaService) {}
  async getMusicList(param) {
    let genreId = param.genreId;
    if (typeof genreId !== 'number') {
      genreId = Number.parseInt(genreId);
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
      genreId = Number.parseInt(genreId);
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
          musicId = Number.parseInt(musicId);
        }
        return {
          musicId: musicId,
          musicGenreId: genreId,
          musicListId: newMusicList.id,
        };
      }),
    });

    const musicList = await this.getMusicFromList({
      userId: request.userId,
      genreId: genreId,
      myListId: newMusicList.id,
    });

    return musicList;
  }

  async updateMusicList(request: addMusicToListType) {
    let genreId = request.musicGenreId;
    if (typeof genreId !== 'number') {
      genreId = Number.parseInt(genreId);
    }

    const oldMusicList = await this.getMusicFromList({
      userId: request.userId,
      genreId: genreId,
      myListId: request.musicListId,
    });

    for (const musicId of request.selectedMusic) {
      const parsedMusicId = typeof musicId !== 'number' ? Number.parseInt(musicId) : musicId;
      if (!oldMusicList.musics.some((music) => music.musicId === parsedMusicId)) {
        await this.prisma.musicMusicList.create({
          data: {
            musicId: parsedMusicId,
            musicGenreId: genreId,
            musicListId: request.musicListId,
          },
        });
      }
    }

    for (const music of oldMusicList.musics) {
      if (!request.selectedMusic.includes(music.musicId)) {
        await this.prisma.musicMusicList.delete({
          where: {
            musicId_musicGenreId_musicListId: {
              musicId: music.musicId,
              musicGenreId: genreId,
              musicListId: request.musicListId,
            },
          },
        });
      }
    }

    const musicList = await this.getMusicFromList({
      userId: request.userId,
      myListId: request.musicListId,
      genreId: request.musicGenreId,
    });

    return musicList;
  }

  async removeMyMusicList(request: DeleteMyListType) {
    let musicGenreId: number = request.genreId;
    if (typeof musicGenreId !== 'number') {
      musicGenreId = Number.parseInt(musicGenreId);
    }
    const deletedMusicList = await this.prisma.musicList.delete({
      where: {
        id: request.musicListId,
        userId: request.userId,
        genreId: musicGenreId,
      },
    });

    return deletedMusicList;
  }

  async getMusicFromList(request: getMyListDetailType) {
    let genreId = request.genreId;
    if (typeof genreId !== 'number') {
      genreId = Number.parseInt(genreId);
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
