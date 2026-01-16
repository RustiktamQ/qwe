import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { TestsController } from './tests.controller';
import { Test } from './tests.model';
import { TestsService } from './tests.service';

@Module({
  controllers: [TestsController],
  providers: [TestsService],
  imports: [SequelizeModule.forFeature([Test]), forwardRef(() => AuthModule)],
})
export class TestsModule {}
