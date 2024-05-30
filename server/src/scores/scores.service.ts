import { Injectable } from '@nestjs/common';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { PrismaService } from 'prisma/prisma.service';
import { ScoreRecord, deleteScoreParams, postScoreType, scoreListParams } from './dto';
import { SongsService } from 'songs/songs.service';
import { createObjectCsvWriter } from 'csv-writer';
import { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

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

    return {
      music: musicInfo,
      scoreList,
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

  async downloadCsv(param, res: Response) {
    let genreId: number = param.genreId;
    if (typeof genreId !== 'number') {
      genreId = parseInt(genreId);
    }

    const scoreList = await this.prisma.scores.findMany({
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
    const records = scoreList.map((score) => ({
      name: score.music.name,
      difficulty: score.musicDifficulty,
      perfectCount: score.perfectCount,
      greatCount: score.greatCount,
      goodCount: score.goodCount,
      badCount: score.badCount,
      missCount: score.missCount,
      createdAt: new Date(score.createdAt).toLocaleDateString('sv-SE'),
    }));

    const csvWriter: CsvWriter<ScoreRecord> = createObjectCsvWriter({
      path: join(__dirname, 'score.csv'),
      header: [
        { id: 'name', title: 'Name' },
        { id: 'difficulty', title: '難易度' },
        { id: 'perfectCount', title: 'Perfect' },
        { id: 'greatCount', title: 'Great' },
        { id: 'goodCount', title: 'Good' },
        { id: 'badCount', title: 'Bad' },
        { id: 'missCount', title: 'Miss' },
        { id: 'createdAt', title: '登録日' },
      ],
      encoding: 'utf8',
    });

    await csvWriter.writeRecords(records);

    const filePath = join(__dirname, 'score.csv');
    res.download(filePath, 'score.csv', (err) => {
      if (err) {
        console.error('Error downloading the file', err);
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting the file', unlinkErr);
        }
      });
    });
  }
}
