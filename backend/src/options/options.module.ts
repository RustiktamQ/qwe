import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { OptionsController } from './options.controller';
import { Option } from './options.model';
import { OptionsService } from './options.service';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService],
  imports: [SequelizeModule.forFeature([Option]), forwardRef(() => AuthModule)],
  exports: [OptionsService],
})
export class OptionsModule {}
