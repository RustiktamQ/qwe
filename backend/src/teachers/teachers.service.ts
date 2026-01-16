import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTeacherDTO } from './dto/create-teacher.dto';
import { Teacher } from './teachers.model';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher) private teacherRepository: typeof Teacher,
  ) {}

  async create(dto: CreateTeacherDTO) {
    const candidate = await this.getByEmail(dto.email);

    if (candidate) {
      throw new HttpException('Такой email уже зареган', HttpStatus.CONFLICT);
    }

    return this.teacherRepository.create(dto);
  }

  async getByEmail(email: string) {
    return this.teacherRepository.findOne({
      where: { email },
    });
  }
}
