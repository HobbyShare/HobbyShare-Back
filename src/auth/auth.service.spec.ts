import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    create: jest.fn(),
    findOneWithPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const registerDto = {
      userName: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hobbies: ['Sports'],
    };

    mockUsersService.create.mockResolvedValue({
      _id: '123',
      userName: 'testuser',
      email: 'test@example.com',
    });

    const result = await service.register(registerDto);

    expect(result).toEqual({ message: 'Usuari registrat correctament' });
    expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
  });

  it('should return access token on successful login', async () => {
    const loginDto = { userName: 'testuser', password: 'password123' };
    const mockUser = {
      _id: '123',
      userName: 'testuser',
      password: 'hashedPassword',
    };

    mockUsersService.findOneWithPassword.mockResolvedValue(mockUser);
    mockUsersService.validatePassword.mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('fake-jwt-token');

    const result = await service.login(loginDto);

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(mockUsersService.findOneWithPassword).toHaveBeenCalledWith(
      'testuser',
    );
    expect(mockJwtService.signAsync).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    const loginDto = { userName: 'nonexistent', password: 'password123' };

    mockUsersService.findOneWithPassword.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const loginDto = { userName: 'testuser', password: 'wrongpassword' };
    const mockUser = {
      _id: '123',
      userName: 'testuser',
      password: 'hashedPassword',
    };

    mockUsersService.findOneWithPassword.mockResolvedValue(mockUser);
    mockUsersService.validatePassword.mockResolvedValue(false);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
