import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // 'select: false' per evitar retornar la contrasenya per defecte
  password: string; // Guardarem la contrasenya hasheada

  @Prop({ required: true })
  hobbies: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
