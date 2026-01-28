import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hobby } from 'src/common/enums/hobby.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // 'select: false' per evitar retornar la contrasenya per defecte
  password: string; // Guardarem la contrasenya hasheada

  @Prop({ type: [String], enum: Hobby, required: true })
  hobbies: Hobby[];
}

export const UserSchema = SchemaFactory.createForClass(User);
