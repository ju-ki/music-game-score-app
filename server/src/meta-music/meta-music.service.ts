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
}
