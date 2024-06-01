import { Injectable } from '@nestjs/common';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { PrismaService } from 'prisma/prisma.service';
import { deleteScoreParams, postScoreType, scoreListParams } from './dto';
import { SongsService } from 'songs/songs.service';
// import { createObjectCsvWriter } from 'csv-writer';
// import { Response } from 'express';
// import { join } from 'path';
// import * as fs from 'fs';
// import { CsvWriter } from 'csv-writer/src/lib/csv-writer';

@Injectable()
export class ScoresService {
  constructor(
    private prisma: PrismaService,
    private songService: SongsService,
    private metaMusicService: MetaMusicService,
  ) {}

  async getList(param) {
    let genreId: number = param.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }

    const musicList = await this.prisma.scores.findMany({
      where: {
        userId: param.userId,
        genreId: genreId,
      },
      include: {
        music: {
          include: {
            metaMusic: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return musicList;
  }

  //スコア詳細
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
      orderBy: [
        {
          missCount: 'asc',
        },
        {
          badCount: 'asc',
        },
        {
          goodCount: 'asc',
        },
        {
          greatCount: 'asc',
        },
      ],
    });

    const musicInfo = await this.songService.getDetailMusic(genreId, musicId);

    const bestMusicScore = await this.getBestScore(searchParams);

    return {
      music: musicInfo,
      scoreList,
      bestScore: bestMusicScore,
    };
  }

  async getDetailScore(param) {
    const detailScore = await this.prisma.scores.findUnique({
      where: {
        id: param.scoreId,
        userId: param.userId,
      },
      include: {
        metaMusic: true,
        music: true,
      },
    });

    return detailScore;
  }

  async postNewScore(post: postScoreType) {
    const metaMusic = await this.metaMusicService.getMetaMusic(post.musicId, post.genreId, post.musicDifficulty);
    const newScore = await this.prisma.scores.upsert({
      where: {
        id: post.scoreId || '',
        userId: post.userId,
      },
      update: {
        perfectPlusCount: post.perfectPlusCount,
        perfectCount: post.perfectCount,
        greatCount: post.greatCount,
        goodCount: post.goodCount,
        badCount: post.badCount,
        missCount: post.missCount,
        musicDifficulty: post.musicDifficulty,
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
        musicDifficulty: post.musicDifficulty,
      },
    });

    return newScore;
  }

  async deleteScore(param: deleteScoreParams) {
    const deletedScore = await this.prisma.scores.delete({
      where: {
        id: param.scoreId,
        userId: param.userId,
      },
    });

    return deletedScore;
  }

  async getBestScore(param: scoreListParams) {
    let genreId: number = param.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }

    let musicId: number = param.musicId;
    if (typeof musicId !== 'number') {
      musicId = parseInt(musicId);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayBestScore = await this.prisma.scores.findFirst({
      where: {
        userId: param.userId,
        musicId: musicId,
        genreId: genreId,
        musicDifficulty: param.musicDifficulty,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        music: {
          include: {
            metaMusic: true,
          },
        },
      },
      orderBy: [
        {
          perfectCount: 'desc',
        },
        {
          greatCount: 'desc',
        },
        {
          goodCount: 'desc',
        },
        {
          badCount: 'desc',
        },
        {
          missCount: 'desc',
        },
      ],
    });

    const weekStartOfDay = new Date();
    weekStartOfDay.setHours(-7, 0, 0, 0);
    const weeklyBestScore = await this.prisma.scores.findFirst({
      where: {
        userId: param.userId,
        musicId: musicId,
        genreId: genreId,
        musicDifficulty: param.musicDifficulty,
        createdAt: {
          gte: weekStartOfDay,
          lt: endOfDay,
        },
      },
      include: {
        music: {
          include: {
            metaMusic: true,
          },
        },
      },
      orderBy: [
        {
          perfectCount: 'desc',
        },
        {
          greatCount: 'desc',
        },
        {
          goodCount: 'desc',
        },
        {
          badCount: 'desc',
        },
        {
          missCount: 'desc',
        },
      ],
    });

    return { today: todayBestScore, week: weeklyBestScore };
  }

  // async downloadCsv(param, res: Response) {
  //   let genreId: number = param.genreId;
  //   if (typeof genreId !== 'number') {
  //     genreId = parseInt(genreId);
  //   }

  //   const scoreList = await this.prisma.scores.findMany({
  //     where: {
  //       userId: param.userId,
  //       genreId: genreId,
  //     },
  //     include: {
  //       music: {
  //         include: {
  //           metaMusic: true,
  //         },
  //       },
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });
  //   const records: ScoreRecord[] = scoreList.map((score) => ({
  //     name: score.music.name,
  //     difficulty: score.musicDifficulty,
  //     perfectCount: score.perfectCount,
  //     greatCount: score.greatCount,
  //     goodCount: score.goodCount,
  //     badCount: score.badCount,
  //     missCount: score.missCount,
  //     createdAt: new Date(score.createdAt).toLocaleDateString('sv-SE'),
  //   }));

  //   const csvWriter = createObjectCsvWriter({
  //     path: join(__dirname, 'score.csv'),
  //     header: [
  //       { id: 'name', title: 'Name' },
  //       { id: 'difficulty', title: '難易度' },
  //       { id: 'perfectCount', title: 'Perfect' },
  //       { id: 'greatCount', title: 'Great' },
  //       { id: 'goodCount', title: 'Good' },
  //       { id: 'badCount', title: 'Bad' },
  //       { id: 'missCount', title: 'Miss' },
  //       { id: 'createdAt', title: '登録日' },
  //     ],
  //     encoding: 'utf8',
  //   }) as CsvWriter<ScoreRecord>;

  //   await csvWriter.writeRecords(records);

  //   const filePath = join(__dirname, 'score.csv');
  //   res.download(filePath, 'score.csv', (err) => {
  //     if (err) {
  //       console.error('Error downloading the file', err);
  //     }
  //     fs.unlink(filePath, (unlinkErr) => {
  //       if (unlinkErr) {
  //         console.error('Error deleting the file', unlinkErr);
  //       }
  //     });
  //   });
  // }
}
