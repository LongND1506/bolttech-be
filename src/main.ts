import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DEFAULT_PORT, provideSwaggerConfig } from './shared';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  provideSwaggerConfig(app);

  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}

bootstrap().catch((err) => console.log(err));
