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

  fetchMusicDifficulties(): void {
    this.httpService
      .get(this.config.get('META_MUSIC_URL'))
      .pipe(map((response) => response.data))
      .subscribe((metaData) =>
        metaData.forEach(async (meta) => {
          await this.prisma.metaMusic.upsert({
            where: {
              id: meta.id.toString(),
            },
            update: {},
            create: {
              id: meta.id.toString(),
              genreId: 1,
              musicId: meta.musicId as number,
              playLevel: meta.playLevel.toString(),
              totalNoteCount: meta.totalNoteCount as number,
              musicDifficulty: meta.musicDifficulty as string,
            },
          });
        }),
      );
  }

  fetchMusicTag(): void {
    this.httpService
      .get(this.config.get('MUSIC_TAG_URL'))
      .pipe(map((response) => response.data))
      .subscribe((metaData) =>
        metaData.forEach(async (tag) => {
          await this.prisma.musicTag.upsert({
            where: {
              id: tag.id,
            },
            update: {},
            create: {
              id: tag.id,
              genreId: 1,
              musicId: tag.musicId as number,
              tagName: tag.musicTag,
              tagId: tag.seq,
            },
          });
        }),
      );
  }
}
