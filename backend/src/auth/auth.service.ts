import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateTeacherDTO } from 'src/teachers/dto/create-teacher.dto';
import { Teacher } from 'src/teachers/teachers.model';
import { TeachersService } from 'src/teachers/teachers.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly teacherService: TeachersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateTeacherDTO) {
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const teacher = await this.teacherService.create({
      ...dto,
      password: hashPassword,
    });
    return this._generateToken(teacher);
  }

  async login(dto: LoginDTO) {
    const teacher = await this._validateUser(dto);
    return this._generateToken(teacher);
  }

  private async _generateToken(teacher: Teacher) {
    const payload = {
      id: teacher.get('teacher_id'),
      email: teacher.get('email'),
      name: teacher.get('name'),
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async _validateUser(dto: LoginDTO) {
    const candidate = await this.teacherService.getByEmail(dto.email);

    if (!candidate)
      throw new UnauthorizedException('Некорректный email или пароль');

    const passwordIsEquals = await bcrypt.compare(
      dto.password,
      candidate.get('password'),
    );

    if (passwordIsEquals) return candidate;

    throw new UnauthorizedException('Некорректный email или пароль');
  }
}
