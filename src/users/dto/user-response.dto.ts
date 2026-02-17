import { Hobby } from '../../common/enums/hobby.enum';

export class UserResponseDto {
  id: string;
  userName: string;
  name: string;
  email: string;
  hobbies: Hobby[];
  createdAt?: Date;
}
