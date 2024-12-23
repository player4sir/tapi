import { Module } from '@nestjs/common';
import { QishuiController } from './controllers/qishui.controller';
import { QishuiParserService } from './services/qishui-parser.service';

@Module({
  controllers: [QishuiController],
  providers: [QishuiParserService],
})
export class QishuiModule {} 