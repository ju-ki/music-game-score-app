import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { postScoreType, scoreListParams } from './dto';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}
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
  deleteScore(@Query() params) {
    return 'Delete Score';
  }
}
