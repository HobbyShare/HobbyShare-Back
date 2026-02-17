import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let model: any;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mockUserModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ _id: '123', ...dto }),
  }));

  (mockUserModel as any).findOne = jest.fn();
  (mockUserModel as any).find = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password when creating user', async () => {
    const createUserDto = {
      userName: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hobbies: ['Sports'],
    };

    (model.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await service.create(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

    expect(mockUserModel).toHaveBeenCalledWith(
      expect.objectContaining({
        userName: 'testuser',
      }),
    );
  });

  it('should throw ConflictException if userName already exists', async () => {
    const createUserDto = {
      userName: 'existinguser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hobbies: ['Sports'],
    };

    (model.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue({ username: 'existinguser' }),
    });

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should find a user by username', async () => {
    const mockUser = { userName: 'testUser', email: 'test@example.com' };

    (model.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await service.findOne('testuser');

    expect(result).toEqual(mockUser);
    expect(model.findOne).toHaveBeenCalledWith({
      userName: 'testuser',
    });
  });

  it('should validate password correctly', async () => {
    const result = await service.validatePassword(
      'password123',
      'hashedPassword',
    );

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword',
    );
  });
});
