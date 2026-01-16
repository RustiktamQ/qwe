import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OptionsService } from 'src/options/options.service';
import { AnswerQuestionDTO } from './dto/answer-question.dto';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { Question } from './questions.model';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question) readonly questionRepository: typeof Question,
    private readonly optionService: OptionsService,
  ) {}

  async create(dto: CreateQuestionDTO) {
    return this.questionRepository.create(dto);
  }

  async delete(id: number) {
    const question = await this.questionRepository.findByPk(id);

    if (!question) {
      throw new HttpException('Вопрос не найден', HttpStatus.NOT_FOUND);
    }

    const o = question.get('option');
    if (o) {
      const oId = o.get('id');

      await this.optionService.delete(oId);
    }

    await question?.destroy();
    return question;
  }

  async answer(dto: AnswerQuestionDTO) {
    const options = await this.optionService.getByQuestionId(dto.question_id);

    if (options.correct === dto.answer) {
      return true;
    }

    return false;
  }
}
