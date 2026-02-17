import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Hobby } from '../common/enums/hobby.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

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
  };

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCreator: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addParticipant: jest.fn(),
    removeParticipant: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user123',
      userName: 'testuser',
      _id: 'user123',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: POST /events - Crear evento
  it('should create a new event', async () => {
    const createEventDto: CreateEventDto = {
      title: 'Test Event',
      description: 'Test Description',
      hobby: Hobby.Sports,
      date: new Date('2026-03-15'),
      lat: 41.3851,
      lng: 2.1734,
    };

    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockEvent as any);

    const result = await controller.create(createEventDto, mockRequest);

    expect(createSpy).toHaveBeenCalledWith(createEventDto, {
      userId: 'user123',
      userName: 'testuser',
    });
    expect(result).toEqual(mockEvent);
  });

  // TEST 2: GET /events - Obtener todos los eventos
  it('should return all events', async () => {
    const events = [
      mockEvent,
      { ...mockEvent, _id: '507f1f77bcf86cd799439012' },
    ];
    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(events as any);

    const result = await controller.findAll();

    expect(findAllSpy).toHaveBeenCalled();
    expect(result).toEqual(events);
  });

  // TEST 3: POST /events/:id/join - Unirse a un evento
  it('should allow user to join an event', async () => {
    const eventWithParticipant = {
      ...mockEvent,
      participants: ['user123'],
    };

    const addParticipantSpy = jest
      .spyOn(service, 'addParticipant')
      .mockResolvedValue(eventWithParticipant as any);

    const result = await controller.joinEvent(
      '507f1f77bcf86cd799439011',
      mockRequest,
    );

    expect(addParticipantSpy).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      'user123',
    );
    expect(result.participants).toContain('user123');
  });

  // TEST 4: DELETE /events/:id/leave - Salirse de un evento
  it('should allow user to leave an event', async () => {
    const eventWithoutParticipant = {
      ...mockEvent,
      participants: [],
    };

    const removeParticipantSpy = jest
      .spyOn(service, 'removeParticipant')
      .mockResolvedValue(eventWithoutParticipant as any);

    const result = await controller.leaveEvent(
      '507f1f77bcf86cd799439011',
      mockRequest,
    );

    expect(removeParticipantSpy).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      'user123',
    );
    expect(result.participants).not.toContain('user123');
  });
});
