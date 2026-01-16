import { ApiProperty } from '@nestjs/swagger';

export class UpdateTestDTO {
  @ApiProperty({ example: 'Основы JS', description: 'Название теста' })
  readonly name: string;
}
