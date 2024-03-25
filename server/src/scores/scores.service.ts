import { Injectable } from '@nestjs/common';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { PrismaService } from 'prisma/prisma.service';
import { postScoreType, scoreListParams } from './dto';

@Injectable()
export class ScoresService {
  constructor(
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}

  async getDetailList(searchParams: scoreListParams) {
    let genreId: number = searchParams.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }

    let musicId: number = searchParams.musicId;
    if (typeof musicId !== 'number') {
      musicId = parseInt(musicId);
    }

    const scoreList = await this.prisma.scores.findMany({
      where: {
        userId: searchParams.userId,
        genreId: genreId,
        musicId: musicId,
        metaMusic: {
          musicDifficulty: searchParams.musicDifficulty,
        },
      },
    });

    return scoreList;
  }

  async getDetailScore(param) {
    const detailScore = await this.prisma.scores.findUnique({
      where: {
        id: param.id,
        userId: param.userId,
      },
      include: {
        metaMusic: true,
      },
    });

    return detailScore;
  }

  async postNewScore(post: postScoreType) {
    console.log(post);
    const metaMusic = await this.metaMusicService.getMetaMusic(post.musicId, post.genreId, post.musicDifficulty);
    const newScore = await this.prisma.scores.upsert({
      where: {
        id: post.id || '',
        userId: post.userId,
      },
      update: {
        perfectPlusCount: post.perfectPlusCount,
        perfectCount: post.perfectCount,
        greatCount: post.greatCount,
        goodCount: post.goodCount,
        badCount: post.badCount,
        missCount: post.missCount,
      },
      create: {
        musicId: post.musicId,
        genreId: post.genreId,
        totalNoteCount: metaMusic.totalNoteCount,
        perfectCount: post.perfectCount,
        greatCount: post.greatCount,
        goodCount: post.goodCount,
        badCount: post.badCount,
        missCount: post.missCount,
        userId: post.userId,
        metaMusicId: metaMusic.id,
      },
      include: {
        metaMusic: true,
      },
    });

    return newScore;
  }
}
