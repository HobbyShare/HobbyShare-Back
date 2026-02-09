import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Hobby } from 'src/common/enums/hobby.enum';

export class CreateEventDto {
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El título no puede superar 100 caracteres' })
  title: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  description: string;

  @IsEnum(Hobby)
  hobby: Hobby;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString(
    {},
    { message: 'La fecha debe tener formato ISO 8601 (YYYY-MM-DD)' },
  )
  date: Date;

  @IsNotEmpty({ message: 'La latitud es obligatoria' })
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @Min(-90, { message: 'La latitud debe estar entre -90 y 90' })
  @Max(90, { message: 'La latitud debe estar entre -90 y 90' })
  lat: number;

  @IsNotEmpty({ message: 'La longitud es obligatoria' })
  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @Min(-180, { message: 'La longitud debe estar entre -180 y 180' })
  @Max(180, { message: 'La longitud debe estar entre -180 y 180' })
  lng: number;
}
