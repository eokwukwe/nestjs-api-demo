import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('The bookmark API')
    .setVersion('1.0')
    .addTag('users', 'users resource')
    .addTag('auth', 'authentication resource')
    .addTag('bookmarks', 'bookmarks resource')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT || 3033);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
