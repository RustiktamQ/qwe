import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDTO {
  @ApiProperty({ example: 'Олег', description: 'Имя учителя' })
  readonly name: string;

  @ApiProperty({ example: 'oleg@gmail.com', description: 'Почта учителя' })
  readonly email: string;

  @ApiProperty({ example: 'Str0ngPass!', description: 'Пароль учителя' })
  readonly password: string;
}
