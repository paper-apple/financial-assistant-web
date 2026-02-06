import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  healthCheck() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV 
    };
  }

  @Get('/')
  root() {
    return { 
      message: 'Financial Assistant API', 
      status: 'running' 
    };
  }
}