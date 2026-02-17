import { Hobby } from './../common/enums/hobby.enum';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user: UserDocument = await this.usersService.create(createUserDto);

    const userObject = user.toObject() as {
      _id: Types.ObjectId;
      userName: string;
      name: string;
      email: string;
      hobbies: Hobby[];
      password?: string;
      createdAt: Date;
    };

    return {
      id: userObject._id.toString(),
      userName: userObject.userName,
      name: userObject.name,
      email: userObject.email,
      hobbies: userObject.hobbies,
      createdAt: userObject.createdAt,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();

    return users.map((user) => ({
      id: user._id.toString(),
      userName: user.userName,
      name: user.name,
      email: user.email,
      hobbies: user.hobbies,
      createdAt: user.createdAt,
    }));
  }
}
