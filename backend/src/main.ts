import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const APP_PORT: string = app.get('ConfigService').get('APP_PORT');

  const options = new DocumentBuilder()
    .setTitle('MWM Api')
    .setDescription('The MWM API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Cors
  app.enableCors({ origin: false }); // TODO create a cors policy once deployed

  // Start the app
  await app.listen(APP_PORT);
  Logger.log(`Api docs can be found here: http://localhost:${APP_PORT}/api/`);
}

bootstrap();
