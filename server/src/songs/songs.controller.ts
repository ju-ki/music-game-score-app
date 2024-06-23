import { Controller, Get, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { searchWords } from './dto';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) {}
  //定期的に実行するようにする
  @Get()
  findAllSongs(@Query() params: { genreId: number }) {
    if (params.genreId == 1) {
      return this.songsService.fetchAllSongs(params);
    } else if (params.genreId == 2) {
      return this.songsService.fetchYumesuteSongs(params);
    }
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
