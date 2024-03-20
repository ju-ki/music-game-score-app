import { Controller, Get, Query } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  //定期的に実行するようにする
  @Get()
  findAllSongs(): void {
    this.songsService.fetchAllSongs();
  }

  @Get('/detail')
  getDetailMusic(@Query() query) {
    console.log(query);
    // return query;
    return this.songsService.getDetailMusic(query.genreId, query.musicId);
  }
}
