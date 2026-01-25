import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module'; // Per accedir a UsersService

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config'; // Per accedir a variables d'entorn

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,

    PassportModule, // Necessari per utilitzar les estratègies de Passport

    JwtModule.registerAsync({
      // Configuració asíncrona per usar ConfigService

      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),

      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy], // Afegeix JwtStrategy com a proveïdor

  exports: [AuthService], // Per si altres mòduls necessiten l'AuthService
})
export class AuthModule {}
