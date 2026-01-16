import { ApiProperty } from '@nestjs/swagger';

export class AnswerQuestionDTO {
  @ApiProperty({ example: 1, description: 'Id вопроса' })
  question_id: number;

  @ApiProperty({ example: 'Обещание', description: 'Текст ответа' })
  answer: string;
}
