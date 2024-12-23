import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';
import { TTSService } from '../services/tts.service';
import { TTSDto } from '../dto/tts.dto';

@ApiTags('文字转语音')
@ApiSecurity('x-api-key')
@Controller('tts')
export class TTSController {
  constructor(private readonly ttsService: TTSService) {}

  @Post()
  @ApiOperation({ summary: '文字转语音', description: '将文字转换为语音' })
  @ApiResponse({ status: 200, description: '成功 - 返回音频文件' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 401, description: 'API Key 无效' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async generateAudio(
    @Body() ttsDto: TTSDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const audioBuffer = await this.ttsService.generateAudio(ttsDto);
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=31536000'
      });
      
      res.end(audioBuffer);
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: error.message || '语音生成失败'
      });
    }
  }
} 