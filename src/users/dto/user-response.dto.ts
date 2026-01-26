// src/users/dto/user-response.dto.ts
import { Hobby } from '../../common/enums/hobby.enum';

export class UserResponseDto {
  id: string;
  username: string;
  name: string;
  email: string;
  hobbies: Hobby[];
}
