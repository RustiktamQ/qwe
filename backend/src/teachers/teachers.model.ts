import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Test } from 'src/tests/tests.model';

interface TeacherCreationAttrs {
  name: string;
  email: string;
  password: string;
}

@Table({ tableName: 'teachers', timestamps: false })
export class Teacher extends Model<Teacher, TeacherCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Id учителя' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  teacher_id: number;

  @ApiProperty({ example: 'Олег', description: 'Имя учителя' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @ApiProperty({ example: 'oleg@gmail.com', description: 'Почта учителя' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'Str0ngPass!', description: 'Пароль учителя' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Test)
  tests: Test[];
}
