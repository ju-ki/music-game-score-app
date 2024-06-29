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
import { ScoresController } from './scores/scores.controller';
import { ScoresService } from './scores/scores.service';
import { MusicListController } from './music-list/music-list.controller';
import { MusicListService } from './music-list/music-list.service';
import { UserService } from './user/user.service';
import { GoogleStrategy } from 'google/strategy/google.strategy';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { MetaMusicController } from './meta-music/meta-music.controller';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    SongsController,
    ScoresController,
    MusicListController,
    AuthController,
    UserController,
    MetaMusicController,
  ],
  providers: [
    AppService,
    SongsService,
    PrismaService,
    MetaMusicService,
    ScoresService,
    MusicListService,
    UserService,
    GoogleStrategy,
    AuthService,
    JwtService,
  ],
})
export class AppModule {}
