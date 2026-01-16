import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDTO {
  @ApiProperty({ example: 1, description: 'Id вопроса' })
  question_id: number;

  @ApiProperty({
    example: 'Обьект асинхронной операции',
    description: 'Правильный ответ',
  })
  correct: string;

  @ApiProperty({ example: 'Тип данных', description: 'Неправильный1' })
  incorrect1: string;

  @ApiProperty({ example: 'Функция', description: 'Неправильный2' })
  incorrect2: string;

  @ApiProperty({ example: 'Обещание', description: 'Неправильный3' })
  incorrect3: string;
}
