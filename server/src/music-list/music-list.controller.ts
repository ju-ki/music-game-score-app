import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { MusicListService } from './music-list.service';
import { addMusicToListType, postMusicListType } from './dto';

@Controller('music-list')
export class MusicListController {
  constructor(private musicListService: MusicListService) {}

  @Get()
  getMusicList(@Query() param) {
    return this.musicListService.getMusicList(param);
  }

  @Post()
  createMusicList(@Body() request: postMusicListType) {
    return this.musicListService.createMusicList(request);
  }

  @Post('/add')
  addMusicToList(@Body() request: addMusicToListType) {
    return this.musicListService.addMusicToList(request);
  }

  @Delete()
  removeMusicFromList(@Query() param) {
    return this.musicListService.removeMusicFromList(param);
  }

  @Get('/getMyList')
  getMusicFromList(@Query() request) {
    return this.musicListService.getMusicFromList(request);
  }
}
