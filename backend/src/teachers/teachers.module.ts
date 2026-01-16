import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeachersController } from './teachers.controller';
import { Teacher } from './teachers.model';
import { TeachersService } from './teachers.service';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [SequelizeModule.forFeature([Teacher])],
  exports: [TeachersService],
})
export class TeachersModule {}
