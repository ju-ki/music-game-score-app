import { Controller, Get } from '@nestjs/common';
import { MetaMusicService } from './meta-music.service';

@Controller('meta-music')
export class MetaMusicController {
  constructor(private metaMusicService: MetaMusicService) {}

  @Get('/difficulty')
  findAllMusicDifficulty() {
    return this.metaMusicService.fetchMusicDifficulties();
  }
  @Get('/tag')
  findAllMusicTag() {
    return this.metaMusicService.fetchMusicTag();
  }
}
