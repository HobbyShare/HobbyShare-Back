/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { Model } from 'mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Hobby } from '../common/enums/hobby.enum';

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<Event>;

  const mockEvent = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Event',
    description: 'Test Description',
    hobby: [Hobby.Sports],
    date: '2026-03-15',
    lat: 41.3851,
    lng: 2.1734,
    creatorId: 'user123',
    creatorUser: 'testuser',
    participants: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockEventModel = jest.fn().mockImplementation((dto: any) => ({
    ...dto,
    _id: '507f1f77bcf86cd799439011',
    save: jest.fn().mockResolvedValue({
      ...dto,
      _id: '507f1f77bcf86cd799439011',
      creatorId: dto.creatorId,
      creatorUser: dto.creatorUser,
      participants: [],
    }) as any,
  })) as any;

  mockEventModel.find = jest.fn() as any;
  mockEventModel.findById = jest.fn() as any;
  mockEventModel.findByIdAndUpdate = jest.fn() as any;
  mockEventModel.findByIdAndDelete = jest.fn() as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new event successfully', async () => {
    const createEventDto: CreateEventDto = {
      title: 'Test Event',
      description: 'Test Description',
      hobby: Hobby.Sports,
      date: new Date('2026-03-15'),
      lat: 41.3851,
      lng: 2.1734,
    };

    const user = { userId: 'user123', userName: 'testuser' };

    const result = await service.create(createEventDto, user);

    expect(result).toBeDefined();
    expect(result.title).toBe('Test Event');
    expect(result.creatorId).toBe('user123');
    expect(result.creatorUser).toBe('testuser');
  });

  it('should return all events', async () => {
    const events = [
      mockEvent,
      { ...mockEvent, _id: '507f1f77bcf86cd799439012' },
    ];

    mockEventModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(events),
    });

    const result = await service.findAll();

    expect(result).toEqual(events);
    expect(mockEventModel.find).toHaveBeenCalled();
  });

  it('should throw NotFoundException when event not found', async () => {
    mockEventModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOne('nonexistent-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ForbiddenException when user tries to update event they did not create', async () => {
    const eventWithDifferentCreator = {
      ...mockEvent,
      creatorId: 'differentUser',
    };

    mockEventModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(eventWithDifferentCreator),
    });

    await expect(
      service.update('507f1f77bcf86cd799439011', {}, 'user123'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should add participant to event successfully', async () => {
    const eventWithoutParticipant = {
      ...mockEvent,
      participants: [],
      save: jest.fn().mockResolvedValue({
        ...mockEvent,
        participants: ['newUser123'],
      }),
    };

    mockEventModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(eventWithoutParticipant),
    });

    const result = await service.addParticipant(
      '507f1f77bcf86cd799439011',
      'newUser123',
    );

    expect(eventWithoutParticipant.save).toHaveBeenCalled();
    expect(eventWithoutParticipant.participants).toContain('newUser123');
  });

  it('should throw ForbiddenException when user tries to join event twice', async () => {
    const eventWithParticipant = {
      ...mockEvent,
      participants: ['user123'],
    };

    mockEventModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(eventWithParticipant),
    });

    await expect(
      service.addParticipant('507f1f77bcf86cd799439011', 'user123'),
    ).rejects.toThrow(ForbiddenException);
  });
});
