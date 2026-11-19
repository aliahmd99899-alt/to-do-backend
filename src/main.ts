import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule, ObserveInstrument } from './app.module.js'; // ← استورد ObserveInstrument

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument, // ← السطر المفقود
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

  await app.listen(3000);
}
bootstrap();