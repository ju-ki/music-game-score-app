import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'client', 'dist'), {
    index: false,
    fallthrough: true,
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'https://music-game-score-app-frontend.onrender.com'], // フロントエンドのオリジンを指定
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // 'Authorization' ヘッダーを追加
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 許可されたメソッド
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
