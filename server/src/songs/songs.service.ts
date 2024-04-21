import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { searchWords } from './dto';

@Injectable({})
export class SongsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}
  //これを定期的に実行できるようにした(DBが更新されたらみたいな感じ)
  fetchAllSongs(): void {
    try {
      this.httpService
        .get(this.config.get('MUSIC_URL'))
        .pipe(map((response) => response.data))
        .subscribe(async (songs) => {
          await Promise.all(
            songs.map(async (song) => {
              await this.prisma.music.upsert({
                where: {
                  id_genreId: {
                    id: song.id,
                    genreId: 1,
                  },
                },
                update: {},
                create: {
                  id: song.id,
                  name: song.title,
                  assetBundleName: song.assetbundleName,
                  genreId: 1,
                  releasedAt: new Date(song.releasedAt),
                },
              });
            }),
          );
          this.metaMusicService.fetchMusicDifficulties();
          this.metaMusicService.fetchMusicTag();
          this.metaMusicService.fetchUnitProfile();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async getDetailMusic(genreId, musicId) {
    const music = await this.prisma.music.findUnique({
      where: {
        id_genreId: {
          id: parseInt(musicId),
          genreId: parseInt(genreId),
        },
      },
      include: {
        metaMusic: true,
      },
    });

    return music;
  }

  //楽曲の検索
  async searchMusic(query: searchWords) {
    const pageSize = 21;
    let tagId: number = query.musicTag;
    if (typeof tagId !== 'number') {
      tagId = parseInt(tagId);
    }
    let page = query.page;
    if (typeof page !== 'number') {
      page = parseInt(page);
    }
    const skipAmount = query.page * pageSize;
    const searchedMusicList = await this.prisma.music.findMany({
      where: {
        name: {
          contains: query.title,
        },
        metaMusic: {
          some: {
            musicDifficulty: query.musicDifficulty,
            playLevel: query.playLevel,
          },
        },
        musicTag: {
          some: {
            tagId: tagId,
          },
        },
      },
      include: {
        metaMusic: true,
        musicTag: true,
      },
      orderBy: {
        id: 'asc',
      },
      skip: skipAmount, // どこからデータを取得するか
      take: pageSize,
    });

    searchedMusicList.forEach((music) => {
      music.metaMusic.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    });

    const totalCount = await this.prisma.music.count({
      where: {
        name: {
          contains: query.title,
        },
        metaMusic: {
          some: {
            musicDifficulty: query.musicDifficulty,
            playLevel: query.playLevel,
          },
        },
        musicTag: {
          some: {
            tagId: tagId,
          },
        },
      },
    });

    if (page === 0) {
      const unitProfile = await this.metaMusicService.getUnitProfile();
      return {
        unitProfile: unitProfile,
        items: searchedMusicList,
        nextPage: skipAmount + pageSize > totalCount ? null : page + 1,
      };
    }

    return {
      items: searchedMusicList,
      nextPage: skipAmount + pageSize > totalCount ? null : page + 1,
    };
  }
}
