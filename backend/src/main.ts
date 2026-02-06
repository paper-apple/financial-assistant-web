// main.ts
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ArgumentsHost, ExceptionFilter, Logger, ValidationPipe } from '@nestjs/common';


const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [ 
      "http://localhost:5173", 
      "https://financial-assistant-web-livid.vercel.app",
      "https://financial-assistant-web.onrender.com",
      /\.vercel\.app$/,
      /\.onrender\.com$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-User-Id'],
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
console.log('DB_USER =', process.env.DB_USER);

bootstrap();