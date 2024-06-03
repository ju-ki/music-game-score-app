import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { map } from 'rxjs';

@Injectable({})
export class MetaMusicService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async fetchMusicDifficulties(musicIdList: number[]) {
    const response = await axios.get(this.config.get('META_MUSIC_URL'));
    const newMusicMetaList = response.data.filter((music) => musicIdList.includes(music.musicId));
    console.log(newMusicMetaList);
    newMusicMetaList.forEach(async (music) => {
      await this.prisma.metaMusic.create({
        data: {
          id: music.id.toString(),
          genreId: 1,
          musicId: music.musicId as number,
          playLevel: music.playLevel.toString(),
          totalNoteCount: music.totalNoteCount as number,
          musicDifficulty: music.musicDifficulty as string,
        },
      });
    });
  }

  async fetchMusicTag(musicIdList: number[]) {
    const response = await axios.get(this.config.get('MUSIC_TAG_URL'));
    const newMusicTagList = response.data.filter((music) => musicIdList.includes(music.musicId));
    console.log(newMusicTagList);
    newMusicTagList.forEach(async (music) => {
      await this.prisma.musicTag.create({
        data: {
          id: music.id,
          genreId: 1,
          musicId: music.musicId as number,
          tagName: music.musicTag,
          tagId: music.seq,
        },
      });
    });
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
