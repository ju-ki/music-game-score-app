import { Injectable } from '@nestjs/common';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { PrismaService } from 'prisma/prisma.service';
import { deleteScoreParams, postScoreType, scoreListParams, scoreParams } from './dto';
import { SongsService } from 'songs/songs.service';
import { Scores } from '@prisma/client';
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

    let sortId: number = searchParams.sortId;
    if (typeof sortId !== 'number') {
      sortId = parseInt(sortId);
    }

    const scoreList = await this.prisma.$queryRaw<Scores[]>`
      SELECT
        "public"."Scores"."id",
        "public"."Scores"."musicId",
        "public"."Scores"."totalNoteCount",
        "public"."Scores"."perfectPlusCount",
        "public"."Scores"."perfectCount",
        "public"."Scores"."greatCount",
        "public"."Scores"."goodCount",
        "public"."Scores"."badCount",
        "public"."Scores"."missCount",
        "public"."Scores"."musicDifficulty",
        "public"."Music"."name",
        "public"."Scores"."createdAt"
      FROM
        "public"."Scores"
      LEFT JOIN
        "public"."Music"
      ON
        "public"."Scores"."musicId" = "public"."Music"."id"
      AND
        "public"."Music"."genreId" = ${genreId}
      WHERE
      "public"."Scores"."userId"= ${searchParams.userId}
      AND
      "public"."Scores"."musicId" = ${musicId}
      AND
      "public"."Scores"."genreId" = ${genreId}
      AND
      "public"."Scores"."musicDifficulty" = ${searchParams.musicDifficulty}
      ORDER BY
        CASE
          WHEN ${sortId} = 1 THEN "public"."Scores"."missCount" * 3 + "public"."Scores"."badCount" * 3 + "public"."Scores"."goodCount" * 2 + "public"."Scores"."greatCount"
          ELSE 0
        END,
        CASE
          WHEN ${sortId} = 1 AND ${genreId} = 2 THEN "public"."Scores"."missCount" * 4 + "public"."Scores"."badCount" * 4 + "public"."Scores"."goodCount" * 3 + "public"."Scores"."greatCount" * 2 + "public"."Scores"."perfectCount"
          ELSE 0
        END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."goodCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."greatCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."perfectCount" END,
        CASE WHEN ${genreId} = 2 THEN "public"."Scores"."perfectPlusCount" END,
      "public"."Scores"."id"
    `;
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
    let date: Date;
    if (post.date) {
      date = new Date(post.date);
    } else {
      date = new Date();
    }

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
        createdAt: date,
      },
      create: {
        musicId: post.musicId,
        genreId: post.genreId,
        totalNoteCount: metaMusic.totalNoteCount,
        perfectPlusCount: post.perfectPlusCount,
        perfectCount: post.perfectCount,
        greatCount: post.greatCount,
        goodCount: post.goodCount,
        badCount: post.badCount,
        missCount: post.missCount,
        userId: post.userId,
        metaMusicId: metaMusic.id,
        musicDifficulty: post.musicDifficulty,
        createdAt: date,
      },
    });

    const scoreList = await this.getDetailList({
      userId: post.userId,
      genreId: post.genreId,
      musicId: post.musicId,
      musicDifficulty: post.musicDifficulty,
      sortId: post.sortId,
    });
    const bestScore = scoreList.scoreList[0] as scoreParams;
    const isBestScore = newScore.id === scoreList.scoreList[0].id;

    return {
      newScore: { ...newScore, musicName: bestScore.name },
      isBestScore,
    };
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

    let sortId: number = param.sortId;
    if (typeof sortId !== 'number') {
      sortId = parseInt(sortId);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayBestScore = await this.prisma.$queryRaw<Scores[]>`
      SELECT
        *
      FROM
        "public"."Scores"
      INNER JOIN
        "public"."Music" ON "public"."Scores"."musicId" = "public"."Music"."id"
      WHERE
      "public"."Scores"."userId"= ${param.userId}
      AND
      "public"."Scores"."musicId" = ${musicId}
      AND
      "public"."Scores"."genreId" = ${genreId}
      AND
      "public"."Scores"."musicDifficulty" = ${param.musicDifficulty}
      AND
      "public"."Scores"."createdAt" BETWEEN ${startOfDay} AND ${endOfDay}
      ORDER BY
        CASE
          WHEN ${sortId} = 1 THEN "public"."Scores"."missCount" * 3 + "public"."Scores"."badCount" * 3 + "public"."Scores"."goodCount" * 2 + "public"."Scores"."greatCount"
          ELSE 0
        END,
        CASE
          WHEN ${sortId} = 1 AND ${genreId} = 2 THEN "public"."Scores"."missCount" * 4 + "public"."Scores"."badCount" * 4 + "public"."Scores"."goodCount" * 3 + "public"."Scores"."greatCount" * 2 + "public"."Scores"."perfectCount"
          ELSE 0
        END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."goodCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."greatCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."perfectCount" END,
        CASE WHEN ${genreId} = 2 THEN "public"."Scores"."perfectPlusCount" END,
      "public"."Scores"."id"
        LIMIT 1
    `;

    const weekStartOfDay = new Date();
    weekStartOfDay.setDate(weekStartOfDay.getDate() - 7);
    weekStartOfDay.setHours(0, 0, 0, 0);
    const weeklyBestScore = await this.prisma.$queryRaw<Scores[]>`
      SELECT
        *
      FROM
        "public"."Scores"
      INNER JOIN
        "public"."Music" ON "public"."Scores"."musicId" = "public"."Music"."id"
      WHERE
      "public"."Scores"."userId"= ${param.userId}
      AND
      "public"."Scores"."musicId" = ${musicId}
      AND
      "public"."Scores"."genreId" = ${genreId}
      AND
      "public"."Scores"."musicDifficulty" = ${param.musicDifficulty}
      AND
      "public"."Scores"."createdAt" BETWEEN ${weekStartOfDay} AND ${endOfDay}
      ORDER BY
        CASE
          WHEN ${sortId} = 1 THEN "public"."Scores"."missCount" * 3 + "public"."Scores"."badCount" * 3 + "public"."Scores"."goodCount" * 2 + "public"."Scores"."greatCount"
          ELSE 0
        END,
        CASE
          WHEN ${sortId} = 1 AND ${genreId} = 2 THEN "public"."Scores"."missCount" * 4 + "public"."Scores"."badCount" * 4 + "public"."Scores"."goodCount" * 3 + "public"."Scores"."greatCount" * 2 + "public"."Scores"."perfectCount"
          ELSE 0
        END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."goodCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."missCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."greatCount" END,
        CASE WHEN ${sortId} = 0 THEN "public"."Scores"."perfectCount" END,
        CASE WHEN ${genreId} = 2 THEN "public"."Scores"."perfectPlusCount" END,
      "public"."Scores"."id"
      LIMIT 1
    `;

    return { today: todayBestScore.length ? todayBestScore[0] : null, week: weeklyBestScore[0] };
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
