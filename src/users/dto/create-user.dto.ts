import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { Hobby } from '../../common/enums/hobby.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'userName is mandatory' })
  @IsString({ message: 'userName must be text' })
  userName: string;

  @IsNotEmpty({ message: 'userName is mandatory' })
  @IsString({ message: 'userName must be text' })
  name: string;

  @IsNotEmpty({ message: 'Email is mandatory' })
  @IsEmail({}, { message: 'Email format example@example.com' })
  email: string;

  @IsNotEmpty({ message: 'Password is mandatory' })
  @MinLength(6)
  password: string;

  @IsArray({ message: 'Hobbies must be an array' })
  @ArrayNotEmpty({ message: 'Select at least one hobby' })
  @IsEnum(Hobby, { each: true, message: 'Invalid hobby selected' })
  hobbies: string[];
}
