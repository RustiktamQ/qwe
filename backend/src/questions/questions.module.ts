import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { OptionsModule } from 'src/options/options.module';
import { QuestionsController } from './questions.controller';
import { Question } from './questions.model';
import { QuestionsService } from './questions.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    SequelizeModule.forFeature([Question]),
    OptionsModule,
    forwardRef(() => AuthModule),
  ],
})
export class QuestionsModule {}
