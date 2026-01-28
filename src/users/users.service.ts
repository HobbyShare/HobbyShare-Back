/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneWithPassword(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, name, email, password, hobbies } = createUserDto;

    const existingUser = await this.userModel.findOne({ username }).exec();

    if (existingUser) {
      throw new ConflictException('This user name already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 rondes de salt

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      name,
      email,
      hobbies,
    });

    return newUser.save();
  }

  async validatePassword(
    passwordPlain: string,
    hashedPasswordFromDb: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordPlain, hashedPasswordFromDb);
  }
}
