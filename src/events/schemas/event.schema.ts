import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true }) // Habilitem timestamps per createdAt i updatedAt
export class Event {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 100 })
  title: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 500 })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, min: -90, max: 90 })
  lat: number;

  @Prop({ required: true, min: -180, max: 180 })
  lng: number;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true, trim: true })
  creatorUser: string;

  @Prop({ type: [String], default: [] })
  participants: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
