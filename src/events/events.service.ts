/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  // CREATE
  async create(createEventDto: CreateEventDto, user: { userId: string, userName: string }) {
    const newEvent = new this.eventModel({
      ...createEventDto,
      creatorId: user.userId,
      creatorUser: user.userName,
      participants: [],
    });

    return newEvent.save();
  }

  // READ ALL
  async findAll() {
    return this.eventModel.find().exec();
  }

  // READ ONE
  async findOne(id: string) {
    const event = await this.eventModel.findById(id).exec();
    
    if (!event) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    
    return event;
  }

  // READ BY CREATOR
  async findByCreator(userId: string) {
    return this.eventModel.find({ creatorId: userId }).exec();
  }

  // UPDATE
  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.findOne(id);

    // Verificar que el usuario sea el creador
    if (event.creatorId !== userId) {
      throw new ForbiddenException('No tienes permiso para editar este evento');
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    return updatedEvent;
  }

  // DELETE
  async remove(id: string, userId: string) {
    const event = await this.findOne(id);

    // 🔒 Verificar que el usuario sea el creador
    if (event.creatorId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este evento');
    }

    await this.eventModel.findByIdAndDelete(id).exec();
    return { message: 'Evento eliminado correctamente' };
  }

  // Apuntarse a un evento
  async addParticipant(eventId: string, userId: string) {
    const event = await this.findOne(eventId);

    if (event.participants.includes(userId)) {
      throw new ForbiddenException('Ya estás apuntado a este evento');
    }

    event.participants.push(userId);
    return event.save();
  }

  // Salirse de un evento
  async removeParticipant(eventId: string, userId: string) {
    const event = await this.findOne(eventId);

    const index = event.participants.indexOf(userId);
    if (index === -1) {
      throw new NotFoundException('No estás apuntado a este evento');
    }

    event.participants.splice(index, 1);
    return event.save();
  }
}
