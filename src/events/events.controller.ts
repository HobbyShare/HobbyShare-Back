// import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
// import { EventsService } from './events.service';
// import { CreateEventDto } from './dto/create-event.dto';
// import { UpdateEventDto } from './dto/update-event.dto';
// import { Event } from './schemas/event.schema';
// import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

// @ApiTags('Llibres') // Agrupa les endpoints a Swagger
// @Controller('Events')
// export class EventsController {
//   constructor(private readonly EventsService: EventsService) {}

//   @Get()
//   @ApiOperation({ summary: 'Obté tots els llibres' })
//   @ApiResponse({ status: 200, description: 'Llistat de llibres', type: [Event] })
//   async findAll(): Promise<Event[]> {
//     return this.EventsService.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obté un llibre per ID' })
//   @ApiParam({ name: 'id', description: 'ID del llibre', type: String })
//   @ApiResponse({ status: 200, description: 'Dades del llibre', type: Event })
//   @ApiResponse({ status: 404, description: 'Llibre no trobat' })
//   async findOne(@Param('id') id: string): Promise<Event> {
//     return this.EventsService.findOne(id);
//   }

//   @Post()
//   @ApiOperation({ summary: 'Crea un nou llibre' })
//   @ApiBody({ type: CreateEventDto, description: 'Dades del llibre a crear' })
//   @ApiResponse({ status: 201, description: 'Llibre creat correctament', type: Event })
//   @ApiResponse({ status: 400, description: 'Dades invàlides' })
//   @ApiResponse({ status: 409, description: 'L\'ISBN ja existeix' }) // Per a ConflictException
//   @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
//   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })) // Validació de DTO
//   async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
//     return this.EventsService.create(createEventDto);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Actualitza un llibre existent' })
//   @ApiParam({ name: 'id', description: 'ID del llibre', type: String })
//   @ApiBody({ type: UpdateEventDto, description: 'Dades del llibre a actualitzar' })
//   @ApiResponse({ status: 200, description: 'Llibre actualitzat', type: Event })
//   @ApiResponse({ status: 400, description: 'Dades invàlides' })
//   @ApiResponse({ status: 404, description: 'Llibre no trobat' })
//   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
//   async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
//     return this.EventsService.update(id, updateEventDto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Elimina un llibre' })
//   @ApiParam({ name: 'id', description: 'ID del llibre', type: String })
//   @ApiResponse({ status: 204, description: 'Llibre eliminat correctament' })
//   @ApiResponse({ status: 404, description: 'Llibre no trobat' })
//   @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content per a DELETE reeixit
//   async remove(@Param('id') id: string): Promise<void> {
//     await this.EventsService.remove(id);
//   }
// }
