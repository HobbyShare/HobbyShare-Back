import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200/',
      'https://hobby-share-front-git-main-nereas-projects-1dce2134.vercel.app/',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HobbyShare API')
    .setDescription(
      'REST API for managing users, authentication, and hobby events. Allows users to create, discover, and join events based on their interests.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'User authentication and registration')
    .addTag('Users', 'User profile management')
    .addTag('Events', 'Event creation and management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Servidor NestJS funcionant al port ${PORT}`);
  console.log(
    `Documentació Swagger disponible a http://localhost:${PORT}/api-docs`,
  );
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
