import { Module } from '@nestjs/common';
import { TTSController } from './controllers/tts.controller';
import { TTSService } from './services/tts.service';

@Module({
  controllers: [TTSController],
  providers: [TTSService],
})
export class TTSModule {} 