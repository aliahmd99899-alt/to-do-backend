import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // 1. احذف السطر الخاص بـ listen تماماً
  // await app.listen(3000);

  // 2. أرجع التطبيق (app) بدلاً من تشغيله
  return app; 
}

// 3. قم بتصدير الاستدعاء مرة واحدة فقط (احذف السطر bootstrap(); المنفصل)
export default bootstrap();