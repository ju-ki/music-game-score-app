import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { searchWords } from './dto';
import axios from 'axios';

@Injectable({})
export class SongsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}
  //これを定期的に実行できるようにした(DBが更新されたらみたいな感じ)
  async fetchAllSongs() {
    try {
      const response = await axios.get(this.config.get('MUSIC_URL'));
      const musicList = await this.searchMusic({ genreId: 1, isInfinityScroll: 'false', page: 0, musicTag: 0 });
      const currentMusicIdSet = new Set(musicList.items.map((value) => value.id));

      const newMusic = response.data.filter((music) => !currentMusicIdSet.has(music.id));

      if (newMusic.length) {
        await this.prisma.$transaction(async (prisma) => {
          for (const music of newMusic) {
            await prisma.music.create({
              data: {
                id: music.id,
                name: music.title,
                assetBundleName: music.assetbundleName,
                genreId: 1,
                releasedAt: new Date(music.releasedAt),
              },
            });
          }

          // MusicDifficultiesの追加
          const responseDifficulties = await axios.get(this.config.get('META_MUSIC_URL'));
          const newMusicMetaList = responseDifficulties.data.filter((music) =>
            newMusic.some((newM) => newM.id === music.musicId),
          );
          for (const music of newMusicMetaList) {
            await prisma.metaMusic.create({
              data: {
                id: music.id.toString(),
                genreId: 1,
                musicId: music.musicId as number,
                playLevel: music.playLevel.toString(),
                totalNoteCount: music.totalNoteCount as number,
                musicDifficulty: music.musicDifficulty as string,
              },
            });
          }

          // MusicTagの追加
          const responseTags = await axios.get(this.config.get('MUSIC_TAG_URL'));
          const newMusicTagList = responseTags.data.filter((music) =>
            newMusic.some((newM) => newM.id === music.musicId),
          );
          for (const music of newMusicTagList) {
            await prisma.musicTag.create({
              data: {
                id: music.id,
                genreId: 1,
                musicId: music.musicId as number,
                tagName: music.musicTag,
                tagId: music.seq,
              },
            });
          }
        });
      }

      const allMusicList = await this.searchMusic({ genreId: 1, isInfinityScroll: 'false', page: 0, musicTag: 0 });
      return {
        newMusic: newMusic,
        allMusic: allMusicList,
      };
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
    let tagId: number = query.musicTag;
    if (typeof tagId !== 'number') {
      tagId = parseInt(tagId);
    }
    let page = query.page;
    if (typeof page !== 'number') {
      page = parseInt(page);
    }

    const isInfinityScroll = query.isInfinityScroll.toLowerCase() !== 'false';

    let skipAmount = 0;

    const pageSize = isInfinityScroll === true ? 21 : 9999;

    if (isInfinityScroll) {
      skipAmount = query.page * pageSize;
    }

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
