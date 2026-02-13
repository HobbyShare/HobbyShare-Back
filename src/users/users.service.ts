import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userName: string): Promise<User | null> {
    return this.userModel.findOne({ userName }).exec();
  }

  async findOneWithPassword(userName: string): Promise<User | null> {
    return this.userModel.findOne({ userName }).select('+password').exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { userName, name, email, password, hobbies } = createUserDto;

    const existingUser = await this.userModel.findOne({ userName }).exec();

    if (existingUser) {
      throw new ConflictException('This user name already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      userName,
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
