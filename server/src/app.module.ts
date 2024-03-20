import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { SongsController } from './songs/songs.controller';
import { SongsService } from './songs/songs.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MetaMusicService } from './meta-music/meta-music.service';
import { MetaMusicController } from './meta-music/meta-music.controller';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, SongsController, MetaMusicController],
  providers: [AppService, SongsService, PrismaService, MetaMusicService],
})
export class AppModule {}
