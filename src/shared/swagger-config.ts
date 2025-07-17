import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Server } from 'http';

export const provideSwaggerConfig = (
  appInstance: NestExpressApplication<Server>,
) => {
  const config = new DocumentBuilder()
    .setTitle('Car Rental')
    .setDescription('Car Rental API documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(appInstance, config);
  SwaggerModule.setup('api', appInstance, documentFactory);
};
