import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { Option } from './options/options.model';
import { OptionsModule } from './options/options.module';
import { Question } from './questions/questions.model';
import { QuestionsModule } from './questions/questions.module';
import { Teacher } from './teachers/teachers.model';
import { TeachersModule } from './teachers/teachers.module';
import { Test } from './tests/tests.model';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),

    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [Teacher, Test, Option, Question],
      autoLoadModels: true,
      synchronize: true,
    }),

    TeachersModule,
    TestsModule,
    OptionsModule,
    QuestionsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
