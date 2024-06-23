import { Controller, Get } from '@nestjs/common';
import { MetaMusicService } from './meta-music.service';

@Controller('meta-music')
export class MetaMusicController {
  constructor(private readonly metaMusicService: MetaMusicService) {}

  @Get('/genre')
  async fetchGenre() {
    return await this.metaMusicService.fetchGenre();
  }
}
