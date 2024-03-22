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
            // tagId: parseInt(query.musicTag.toString()),
            tagId: query.musicTag,
          },
        },
      },
      include: {
        metaMusic: true,
      },
    });
    return searchedMusicList;
  }
}
