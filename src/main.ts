import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // تهيئة التطبيق دون بدء الاستماع
  await app.init();

  // إرجاع كائن التطبيق ليتعامل معه Vercel
  return app.getHttpAdapter().getInstance(); 
}

// تصدير الخادم ليتعرف عليه Vercel
export default bootstrap();