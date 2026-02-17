import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { JwtService } from '@nestjs/jwt';

import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<{ message: string }> {
    await this.usersService.create(registerDto);

    return { message: 'Usuari registrat correctament' };
  }

  async login(loginDto: LoginUserDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneWithPassword(loginDto.userName);

    if (!user) {
      throw new UnauthorizedException('Credencials invàlides');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,

      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credencials invàlides');
    }

    const payload = { userName: user.userName, sub: user._id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
