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

  // إعادة استدعاء listen أمر ضروري ليتعرف Vercel على الخادم
  await app.listen(process.env.PORT ?? 3000);

  // تصدير التطبيق لـ Vercel
  return app;
}

export default bootstrap();