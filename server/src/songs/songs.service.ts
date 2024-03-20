import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MetaMusicService } from 'meta-music/meta-music.service';

@Injectable({})
export class SongsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}

  fetchAllSongs(): void {
    try {
      this.httpService
        .get(this.config.get('MUSIC_URL'))
        .pipe(map((response) => response.data))
        .subscribe((songs) => {
          songs.forEach(async (song) => {
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
                genreId: 1,
                releasedAt: new Date(song.releasedAt),
              },
            });
          });
        });
      this.metaMusicService.fetchMusicDifficulties();
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
}
