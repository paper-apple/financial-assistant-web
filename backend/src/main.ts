import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../certs/localhost+2-key.pem'),
    cert: fs.readFileSync('../certs/localhost+2.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    // origin: '*',
    // methods: '*',
    // allowedHeaders: '*',
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();