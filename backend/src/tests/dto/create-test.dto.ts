import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDTO {
  @ApiProperty({ example: 1, description: 'Id учителя' })
  readonly teacher_id: number;

  @ApiProperty({ example: 'Основы JS', description: 'Название теста' })
  readonly name: string;
}
