import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { searchWords } from './dto';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable({})
export class SongsService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}
  //これを定期的に実行できるようにした(DBが更新されたらみたいな感じ)
  async fetchAllSongs(params: { genreId: number }) {
    try {
      let genreId: number = params.genreId;
      if (typeof genreId !== 'number') {
        genreId = parseInt(genreId);
      }
      const response = await axios.get(this.config.get('MUSIC_URL'));
      const musicList = await this.searchMusic({
        genreId: genreId,
        isInfinityScroll: 'false',
        page: 0,
        musicTag: 0,
      });
      const currentMusicIdSet = new Set(musicList.items.map((value) => value.id));

      const newMusic = response.data.filter((music) => !currentMusicIdSet.has(music.id));

      //新規楽曲がある場合のみ追加処理を行う
      if (newMusic.length) {
        await this.prisma.$transaction(async (prisma) => {
          for (const music of newMusic) {
            await prisma.music.create({
              data: {
                id: music.id,
                name: music.title,
                assetBundleName: music.assetbundleName,
                genreId: genreId,
                releasedAt: new Date(music.releasedAt),
              },
            });
          }

          // MusicDifficultiesの追加
          const responseDifficulties = await axios.get(this.config.get('META_MUSIC_URL'));
          const newMusicMetaList = responseDifficulties.data.filter((music) =>
            newMusic.some((newMeta) => newMeta.id === music.musicId),
          );
          for (const music of newMusicMetaList) {
            await prisma.metaMusic.create({
              data: {
                id: music.id.toString(),
                genreId: genreId,
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
            newMusic.some((newTag) => newTag.id === music.musicId),
          );
          for (const music of newMusicTagList) {
            await prisma.musicTag.create({
              data: {
                id: music.id,
                genreId: genreId,
                musicId: music.musicId as number,
                tagName: music.musicTag,
                tagId: music.seq,
              },
            });
          }
        });
      }

      const allMusicList = await this.searchMusic({
        genreId: genreId,
        isInfinityScroll: 'false',
        page: 0,
        musicTag: 0,
      });
      return {
        newMusic: newMusic,
        allMusic: allMusicList,
      };
    } catch (err) {
      console.log(err);
    }
  }

  private headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  async fetchYumesuteSongs(params: { genreId: number }) {
    let genreId: number = params.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }
    const loadUrl = this.config.get('YUMESUTE_URL');

    try {
      const response = await axios.get(loadUrl, { headers: this.headers });
      const songs = [];
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const songItems = $('table').eq(3).find('tbody').children('tr').toArray();
        const difficulty = ['normal', 'hard', 'extra', 'stella', 'olivier'];
        let idx = 0;
        for (const song of songItems) {
          await this.prisma.$transaction(async (prisma) => {
            const tds = $(song).find('td');
            const each = tds.eq(2);

            if (tds.length !== 10 && each.find('a').length) {
              const noteCountList = [0, 0, 0, parseInt(tds.eq(9).text()), parseInt(tds.eq(10).text())];
              const song = {
                releaseAt: tds.eq(15).text(),
                title: tds.eq(2).text(),
                note_count: noteCountList,
                normal: tds.eq(4).text(),
                hard: tds.eq(5).text(),
                extra: tds.eq(6).text(),
                stella: tds.eq(7).text(),
                olivier: tds.eq(8).text(),
              };

              songs.push(song);

              await this.prisma.music.upsert({
                where: {
                  id_genreId: {
                    id: idx,
                    genreId: genreId,
                  },
                },
                update: {
                  name: tds.eq(2).text(),
                  assetBundleName: '',
                  releasedAt: new Date(),
                },
                create: {
                  id: idx,
                  name: tds.eq(2).text(),
                  assetBundleName: '',
                  genreId: genreId,
                  releasedAt: new Date(),
                },
              });

              for (const diff of difficulty) {
                let totalNoteCount = song.note_count[difficulty.indexOf(diff)];
                if (typeof totalNoteCount !== 'number') {
                  totalNoteCount = parseInt(totalNoteCount);
                }
                await prisma.metaMusic.upsert({
                  where: {
                    id: `${idx}-${diff}`,
                  },
                  update: {
                    musicId: idx,
                    playLevel: song[diff],
                    totalNoteCount: totalNoteCount,
                    musicDifficulty: diff,
                  },
                  create: {
                    id: `${idx}-${diff}`,
                    genreId: genreId,
                    musicId: idx,
                    playLevel: song[diff],
                    totalNoteCount: totalNoteCount,
                    musicDifficulty: diff,
                  },
                });
              }

              idx++;
            }
          });
        }

        const allMusicList = await this.searchMusic({
          genreId: genreId,
          isInfinityScroll: 'false',
          page: 0,
          musicTag: 0,
        });

        return {
          newMusic: songs,
          allMusic: allMusicList,
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getDetailMusic(genreId, musicId) {
    const music = await this.prisma.music.findUnique({
      where: {
        id_genreId: {
          id: Number.parseInt(musicId),
          genreId: Number.parseInt(genreId),
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
      tagId = Number.parseInt(tagId);
    }
    let page = query.page;
    if (typeof page !== 'number') {
      page = Number.parseInt(page);
    }
    let genreId = query.genreId;
    if (typeof genreId !== 'number') {
      genreId = Number.parseInt(genreId);
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
        genreId: genreId,
        metaMusic: {
          some: {
            musicDifficulty: query.musicDifficulty,
            playLevel: query.playLevel,
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
      music.metaMusic.sort((a, b) => Number.parseInt(a.id) - Number.parseInt(b.id));
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
        // musicTag: {
        //   some: {
        //     tagId: tagId,
        //   },
        // },
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
