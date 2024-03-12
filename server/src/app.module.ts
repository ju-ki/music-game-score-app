import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { SongsController } from './songs/songs.controller';
import { SongsService } from './songs/songs.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, SongsController],
  providers: [AppService, SongsService],
})
export class AppModule {}
