import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { AnswerQuestionDTO } from './dto/answer-question.dto';
import { CreateQuestionDTO } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateQuestionDTO) {
    return this.questionService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.questionService.delete(id);
  }

  @Post()
  answer(@Body() dto: AnswerQuestionDTO) {
    return this.questionService.answer(dto);
  }
}
