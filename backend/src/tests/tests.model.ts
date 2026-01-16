import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { Question } from 'src/questions/questions.model';
import { Teacher } from 'src/teachers/teachers.model';

interface TestCreationAttrs {
  teacher_id: number;
  name: string;
}

@Table({ tableName: 'tests', timestamps: false })
export class Test extends Model<Test, TestCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id теста' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  test_id: number;

  @ApiProperty({ example: 1, description: 'Id учителя' })
  @ForeignKey(() => Teacher)
  @Index
  @Column({ type: DataType.INTEGER, allowNull: false })
  teacher_id: number;

  @ApiProperty({ example: 'Основы JS', description: 'Название теста' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsTo(() => Teacher, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @HasMany(() => Question, { foreignKey: 'test_id' })
  questions: Question[];
}
