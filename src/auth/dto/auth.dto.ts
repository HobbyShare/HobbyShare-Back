import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Hobby } from 'src/common/enums/hobby.enum';

export class RegisterUserDto {
  @ApiProperty({ description: 'userName', example: 'janedoe' })
  @IsNotEmpty({ message: 'userName is mandatory' })
  @IsString({ message: 'userName must be text' })
  userName: string;

  @ApiProperty({ description: 'Name', example: 'Jane Doe' })
  @IsNotEmpty({ message: 'Name is mandatory' })
  @IsString({ message: 'Name must be a chain of text' })
  name: string;

  @ApiProperty({ description: 'Email', example: 'janedoe@gmail.com' })
  @IsNotEmpty({ message: 'Email is mandatory' })
  @IsEmail({}, { message: 'Email format example@example.com' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'passwordSegura123' })
  @IsNotEmpty({ message: 'Password is mandatory' })
  @IsString({ message: 'Password must be a chain of test' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;

  @IsArray({ message: 'Hobbies must be an array' })
  @ArrayNotEmpty({ message: 'Select at least one hobby' })
  @IsEnum(Hobby, { each: true, message: 'Invalid hobby selected' })
  hobbies: string[];
}

export class LoginUserDto {
  @ApiProperty({ description: 'userName', example: 'janedoe' })
  @IsNotEmpty({ message: 'userName is mandatory' })
  userName: string;

  @ApiProperty({ description: 'Password', example: 'passwordSegura123' })
  @IsNotEmpty({ message: 'Password is mandatory' })
  password: string;
}
