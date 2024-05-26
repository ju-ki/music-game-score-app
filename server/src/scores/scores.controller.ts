import { Body, Controller, Delete, Get, Post, Query, Res } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { deleteScoreParams, postScoreType, scoreListParams } from './dto';
import { Response } from 'express';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}
  //スコアが登録されている楽曲一覧を表示
  @Get('/list')
  getList(@Query() param) {
    return this.scoresService.getList(param);
  }
  //曲のスコア一覧を取得する
  @Get('/detailList')
  getDetailList(@Query() searchParams: scoreListParams) {
    return this.scoresService.getDetailList(searchParams);
  }

  //スコア詳細
  @Get('/detail')
  getDetailScore(@Query() param) {
    return this.scoresService.getDetailScore(param);
  }

  //スコアを追加する
  @Post()
  postNewScore(@Body() request: postScoreType) {
    return this.scoresService.postNewScore(request);
  }

  //スコア削除(複数)
  @Delete()
  deleteScore(@Query() params: deleteScoreParams) {
    return this.scoresService.deleteScore(params);
  }

  //csvダウンロード
  @Get('/csv')
  downloadCsv(@Query() param, @Res() res: Response) {
    return this.scoresService.downloadCsv(param, res);
  }
}
