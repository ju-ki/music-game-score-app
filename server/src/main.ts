import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // フロントエンドのオリジンを指定
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // 'Authorization' ヘッダーを追加
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 許可されたメソッド
  });
  await app.listen(3000);
}
bootstrap();
