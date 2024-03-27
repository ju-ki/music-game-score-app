import { Controller, Get, Post, Query } from '@nestjs/common';
import { MusicListService } from './music-list.service';

@Controller('music-list')
export class MusicListController {
  constructor(private musicListService: MusicListService) {}

  @Get()
  getMusicList(@Query() param) {
    return this.musicListService.getMusicList(param);
  }

  @Post()
  createMusicList() {
    return this.musicListService.createMusicList();
  }
}
