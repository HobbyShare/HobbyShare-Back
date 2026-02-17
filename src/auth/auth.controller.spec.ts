import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto = {
      userName: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hobbies: ['Sports'],
    };

    mockAuthService.register.mockResolvedValue({
      message: 'Usuari registrat correctament',
    });

    const result = await controller.register(registerDto);

    expect(result).toEqual({ message: 'Usuari registrat correctament' });
    expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
  });

  it('should login a user', async () => {
    const loginDto = { userName: 'testuser', password: 'password123' };

    mockAuthService.login.mockResolvedValue({ access_token: 'fake-token' });

    const result = await controller.login(loginDto);

    expect(result).toEqual({ access_token: 'fake-token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });
});
