import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Cuando se implemente

interface RequestWithUser extends Request {
  user: {
    userId: string;
    userName: string;
    _id: string;
  };
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // CREATE - Crear un evento
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser, // Aquí vendrá req.user del JWT
  ) {
    // TEMPORAL: mientras no tenga JWT, simula el usuario
    const user = {
      userId: req.user.userId,
      userName: req.user.userName,
    };

    return this.eventsService.create(createEventDto, user); // 👈 Cuando tengas JWT
  }

  // READ - Obtener todos los eventos
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  // READ - Obtener un evento por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // READ - Obtener eventos del usuario autenticado
  @Get('user/my-events')
  @UseGuards(JwtAuthGuard) // Descomentar cuando esté el guard
  async findMyEvents(@Req() req: RequestWithUser) {
    return this.eventsService.findByCreator(req.user.userId);
  }

  // UPDATE - Actualizar un evento
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Descomentar cuando esté el guard
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.userId); // Cuando tenga JWT
  }

  // DELETE - Eliminar un evento
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Descomentar cuando esté el guard
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 en lugar de 200
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.remove(id, req.user.userId); // Cuando tenga JWT
  }

  // BONUS - Apuntarse a un evento
  @Post(':id/join')
  @UseGuards(JwtAuthGuard) // Descomentar cuando esté el guard
  async joinEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.addParticipant(id, req.user.userId); // Cuando tenga JWT
  }

  // BONUS - Salirse de un evento
  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard) // Descomentar cuando esté el guard
  async leaveEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.removeParticipant(id, req.user.userId); // Cuando tenga JWT
  }
}
