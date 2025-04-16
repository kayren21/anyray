import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // allow your frontend
    credentials: true,               // allow cookies if needed
  });

  await app.listen(3000);
}
bootstrap();
