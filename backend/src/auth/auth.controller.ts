import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateTeacherDTO } from 'src/teachers/dto/create-teacher.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateTeacherDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('isAuthed')
  async isAuthed() {
    return true;
  }
}
