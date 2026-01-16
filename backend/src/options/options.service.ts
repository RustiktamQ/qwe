import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOptionDTO } from './dto/create-option.dto';
import { Option } from './options.model';

@Injectable()
export class OptionsService {
  constructor(@InjectModel(Option) private optionRepository: typeof Option) {}

  async create(dto: CreateOptionDTO) {
    return this.optionRepository.create(dto);
  }

  async edit(id: number, dto: CreateOptionDTO) {
    const option = await this.optionRepository.findByPk(id);
    if (!option) {
      throw new HttpException('Вариант не найден', HttpStatus.NOT_FOUND);
    }

    return option.update(dto);
  }

  async delete(id: number) {
    const option = await this.optionRepository.findByPk(id);

    if (!option) {
      throw new HttpException('Вариант ответа не найден', HttpStatus.NOT_FOUND);
    }

    await option.destroy();
    return option;
  }

  async getByQuestionId(id: number): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { question_id: id },
    });

    if (!option) {
      throw new HttpException(
        'Варианты ответа не найдены для вопроса: ' + id,
        HttpStatus.NOT_FOUND,
      );
    }

    return option;
  }
}
