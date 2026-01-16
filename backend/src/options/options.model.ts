import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Question } from 'src/questions/questions.model';

interface OptionCreationAttrs {
  question_id: number;
  correct: string;
  incorrect1: string;
  incorrect2: string;
  incorrect3: string;
}

@Table({ tableName: 'options', timestamps: false })
export class Option extends Model<Option, OptionCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id варианта ответа' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  option_id: number;

  @ApiProperty({ example: 1, description: 'Id вопроса' })
  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  question_id: number;

  @BelongsTo(() => Question, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  question: Question;

  @ApiProperty({
    example: 'Обьект асинхронной операции',
    description: 'Правильный ответ',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  correct: string;

  @ApiProperty({ example: 'Тип данных', description: 'Неправильный1' })
  @Column({ type: DataType.STRING, allowNull: false })
  incorrect1: string;

  @ApiProperty({ example: 'Функция', description: 'Неправильный2' })
  @Column({ type: DataType.STRING, allowNull: false })
  incorrect2: string;

  @ApiProperty({ example: 'Обещание', description: 'Неправильный3' })
  @Column({ type: DataType.STRING, allowNull: false })
  incorrect3: string;
}
