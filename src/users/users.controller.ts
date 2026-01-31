import { Hobby } from './../common/enums/hobby.enum';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { Types } from 'mongoose';

@ApiTags('Users') // Agrupa les endpoints a Swagger
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
      userName: userObject.userName, // Mapeo del nombre de campo
      name: userObject.name,
      email: userObject.email,
      hobbies: userObject.hobbies,
      createdAt: userObject.createdAt,
    };
  }
}
