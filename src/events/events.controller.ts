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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    const user = {
      userId: req.user.userId,
      userName: req.user.userName,
    };

    return this.eventsService.create(createEventDto, user);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get('user/my-events')
  @UseGuards(JwtAuthGuard)
  async findMyEvents(@Req() req: RequestWithUser) {
    return this.eventsService.findByCreator(req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.remove(id, req.user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.addParticipant(id, req.user.userId);
  }

  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveEvent(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.removeParticipant(id, req.user.userId);
  }
}
