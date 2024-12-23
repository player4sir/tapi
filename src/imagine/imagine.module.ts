import { Module } from '@nestjs/common';
import { ImagineController } from './controllers/imagine.controller';
import { ImagineService } from './services/imagine.service';

@Module({
  controllers: [ImagineController],
  providers: [ImagineService],
})
export class ImagineModule {} 