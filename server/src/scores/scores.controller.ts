import { Request } from 'express';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}
  //曲のスコア一覧を取得すう
  @Get('/detailList')
  getDetailList() {
    return 'Detail List';
  }

  //スコア詳細
  @Get('/detail')
  getDetailScore() {
    return 'Detail Score';
  }

  //スコアを追加する
  @Post()
  postNewScore(@Body() request: Request) {
    return this.scoresService.postNewScore(request);
  }
}
