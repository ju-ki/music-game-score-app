import { Controller, Get, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { searchWords } from './dto';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  //定期的に実行するようにする
  @Get()
  findAllSongs() {
    return this.songsService.fetchAllSongs();
  }

  @Get('/yumesute')
  findYumesuteSongs() {
    return this.songsService.fetchYumesuteSongs();
  }

  @Get('/detail')
  getDetailMusic(@Query() query) {
    return this.songsService.getDetailMusic(query.genreId, query.musicId);
  }

  //検索処理
  @Get('/search')
  searchMusic(@Query() dto: searchWords) {
    return this.songsService.searchMusic(dto);
  }
}
