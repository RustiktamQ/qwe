import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'oleg@gmail.com', description: 'Почта' })
  email: string;

  @ApiProperty({ example: 'Str0ngPass!', description: 'Пароль' })
  password: string;
}
