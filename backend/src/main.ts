// // main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import cookieParser from 'cookie-parser';

// async function bootstrap() {
//   console.log('NODE_ENV =', process.env.NODE_ENV);

//   const app = await NestFactory.create(AppModule);

//   app.use(cookieParser());

//   app.enableCors({
//     origin: true,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   });

//   await app.listen(3000);
// }

// bootstrap();


// main.ts
import * as dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные из .env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  console.log('NODE_ENV =', process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // app.enableCors({
  //   origin: true,
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  // });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
console.log('DB_USER =', process.env.DB_USER);

bootstrap();