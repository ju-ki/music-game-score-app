import { Injectable } from '@nestjs/common';
import { MetaMusicService } from 'meta-music/meta-music.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ScoresService {
  constructor(
    private prisma: PrismaService,
    private metaMusicService: MetaMusicService,
  ) {}

  async postNewScore(post) {
    console.log(post);
    const metaMusic = await this.metaMusicService.getMetaMusic(post.musicId, post.genreId, post.musicDifficulty);
    // const newScore = await this.prisma.scores.create({
    //   data: {
    //     musicId: post.musicId,
    //     difficultyLevel: post.difficultyLevel,
    //     totalNoteCount: post.totalNoteCount,
    //     perfectCount: post.perfectCount,
    //     greatCount: post.greatCount,
    //     goodCount: post.goodCount,
    //     badCount: post.badCount,
    //     missCount: post.missCount,
    //     userId: post.userId,
    //     metaMusicId: post.metaMusicId,
    //   },
    //   include: {
    //     metaMusic: true,
    //   },
    // });

    // return newScore;
    return metaMusic;
  }
}
