import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { map } from 'rxjs';

@Injectable({})
export class MetaMusicService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async fetchGenre() {
    const genre = await this.prisma.genre.findMany({});

    return genre;
  }

  async fetchUnitProfile() {
    this.httpService
      .get(this.config.get('MUSIC_UNIT_PROFILE_URL'))
      .pipe(map((response) => response.data))
      .subscribe((metaData) =>
        metaData.forEach(async (profile) => {
          await this.prisma.unitProfile.upsert({
            where: {
              seq_genreId: {
                seq: profile.seq as number,
                genreId: 1,
              },
            },
            update: {},
            create: {
              genreId: 1,
              seq: profile.seq,
              unitName: profile.unit,
              unitProfileName: profile.unitName,
            },
          });
        }),
      );
  }

  async getMetaMusic(musicId: number, genreId: number, musicDifficulty: string) {
    const metaMusic = await this.prisma.metaMusic.findFirst({
      where: {
        musicId: musicId,
        genreId: genreId,
        musicDifficulty: musicDifficulty,
      },
      include: {
        music: true,
      },
    });

    return metaMusic;
  }

  async getUnitProfile() {
    const unitProfile = await this.prisma.unitProfile.findMany({
      where: {
        genreId: 1,
      },
      orderBy: {
        seq: 'asc',
      },
    });

    return unitProfile;
  }
}
