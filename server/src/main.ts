import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://music-game-score-app-frontend.onrender.com',
      'https://music-game-score-app-management.onrender.com',
    ], // フロントエンドのオリジンを指定
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // 'Authorization' ヘッダーを追加
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 許可されたメソッド
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
