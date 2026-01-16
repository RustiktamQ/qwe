import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTestDTO } from './dto/create-test.dto';
import { UpdateTestDTO } from './dto/update-test.dto';
import { Test } from './tests.model';

@Injectable()
export class TestsService {
  constructor(@InjectModel(Test) private testRepository: typeof Test) {}

  async create(dto: CreateTestDTO) {
    return this.testRepository.create(dto);
  }

  async update(id: number, dto: UpdateTestDTO) {
    const test = await this.testRepository.findByPk(id);

    if (!test) {
      throw new HttpException('Тест не найден', HttpStatus.NOT_FOUND);
    }

    return test.update(dto);
  }

  async getAll() {
    return this.testRepository.findAll({ include: { all: true } });
  }

  async getAllByTeacher(id: number) {
    return this.testRepository.findAll({
      where: { teacher_id: id },
      include: { all: true },
    });
  }

  async delete(id: number) {
    const test = await this.testRepository.findByPk(id);

    if (!test) {
      throw new HttpException('Тест не найден', HttpStatus.NOT_FOUND);
    }

    await test?.destroy();
    return test;
  }
}
