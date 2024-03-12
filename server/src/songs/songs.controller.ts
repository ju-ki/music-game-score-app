import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Controller('songs')
export class SongsController {
  constructor(private httpService: HttpService) {}
  @Get()
  findAllSongs(): Observable<any> {
    try {
      return this.httpService
        .get('https://sekai-world.github.io/sekai-master-db-diff/musics.json')
        .pipe(map((response) => response.data));
    } catch (err) {
      console.log(err);
    }
  }
}
