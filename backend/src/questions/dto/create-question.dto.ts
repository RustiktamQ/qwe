import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDTO {
  @ApiProperty({ example: 2, description: 'Id теста' })
  test_id: number;

  @ApiProperty({ example: 'Что такое Promise?', description: 'Текст вопроса' })
  text: string;
}
