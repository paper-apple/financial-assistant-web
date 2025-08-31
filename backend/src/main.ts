// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // origin: 'http://localhost:5173',
    // // credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // // allowedHeaders: ['Content-Type', 'Authorization'],

    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  await app.listen(3000);
}
bootstrap();