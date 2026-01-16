import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { Option } from 'src/options/options.model';
import { Test } from 'src/tests/tests.model';

interface QuestionCreationAttrs {
  test_id: number;
  text: string;
}

@Table({ tableName: 'questions', timestamps: false })
export class Question extends Model<Question, QuestionCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id вопроса' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  question_id: number;

  @ApiProperty({ example: 2, description: 'Id теста' })
  @ForeignKey(() => Test)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  test_id: number;

  @BelongsTo(() => Test, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  test: Test;

  @ApiProperty({ example: 'Что такое Promise?', description: 'Тест вопроса' })
  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @HasOne(() => Option, { foreignKey: 'question_id' })
  option: Option;
}
