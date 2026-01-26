// src/app.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // Per gestionar variables d'entorn
// import { UsersModule } from './users/users.module'; // El crearem en el pas 3
import { EventsModule } from './events/events.module'; // El crearem en el pas 3
// import { UsersModule } from './users/users.module';
// import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Fent que les variables d'entorn estiguin disponibles globalment
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/hobbyshare-api',
    ), // no se si se hace una api de cada modulo
    // UsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
