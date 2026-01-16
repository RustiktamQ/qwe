import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { CreateTestDTO } from './dto/create-test.dto';
import { UpdateTestDTO } from './dto/update-test.dto';
import { TestsService } from './tests.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testService: TestsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateTestDTO) {
    return this.testService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTestDTO) {
    return this.testService.update(id, dto);
  }

  @Get()
  getAll() {
    return this.testService.getAll();
  }

  @Get('teacher/:id')
  getByTeacher(@Param('id') id: number) {
    return this.testService.getAllByTeacher(id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.testService.delete(id);
  }
}
