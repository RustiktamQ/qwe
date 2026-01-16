import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { CreateOptionDTO } from './dto/create-option.dto';
import { OptionsService } from './options.service';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionService: OptionsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateOptionDTO) {
    return this.optionService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  edit(@Param('id') id: number, @Body() dto: CreateOptionDTO) {
    return this.optionService.edit(id, dto);
  }

  @Get('question/:id')
  getByQuestionId(@Param('id') id: number) {
    return this.optionService.getByQuestionId(id);
  }
}
