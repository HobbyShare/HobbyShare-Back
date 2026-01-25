import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:4200', // Frontend Angular
    credentials: true,
  });

  // Configuració de la ValidationPipe globalment per a tots els DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propietats no definides en el DTO
      forbidNonWhitelisted: true, // Llença un error si hi ha propietats no definides
      transform: true, // Transforma automàticament els tipus dels DTOs
    }),
  );

  // Configuració de Swagger
  const config = new DocumentBuilder()
    .setTitle('HobbyShare API')
    .setDescription(
      'REST API for managing users, authentication, and hobby events. Allows users to create, discover, and join events based on their interests.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'User authentication and registration') // Afegim el tag que usem al controller
    .addTag('Users', 'User profile management') // Afegim el tag que usem al controller
    .addTag('Events', 'Event creation and management') // Afegim el tag que usem al controller
    .addBearerAuth() // ✅ Para JWT authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // La documentació estarà disponible a /api-docs

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
