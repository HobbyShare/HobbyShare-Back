// import {
//   IsString,
//   IsNotEmpty,
//   IsNumber,
//   Min,
//   Max,
//   IsOptional,
//   IsISBN,
// } from 'class-validator';

// export class CreateEventDto {
//   @IsNotEmpty({ message: 'El títol és obligatori' })
//   @IsString({ message: 'El títol ha de ser una cadena de text' })
//   title: string;

//   @IsNotEmpty({ message: "L'autor és obligatori" })
//   @IsString({ message: "L'autor ha de ser una cadena de text" })
//   author: string;

//   @IsOptional()
//   @IsNumber({}, { message: "L'any ha de ser un número" })
//   @Min(1000, { message: "L'any ha de ser superior a 1000" })
//   @Max(new Date().getFullYear(), { message: "L'any no pot ser futur" })
//   year?: number;

//   @IsOptional()
//   @IsISBN('13', { message: "L'ISBN no és vàlid (ha de ser ISBN-10 o ISBN-13)" })
//   isbn?: string;
// }
