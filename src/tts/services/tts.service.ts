import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TTSDto } from '../dto/tts.dto';

@Injectable()
export class TTSService {
  constructor(private configService: ConfigService) {}

  async generateAudio(ttsDto: TTSDto): Promise<Buffer> {
    try {
      const { text, voice } = ttsDto;
      const apiUrl = this.configService.get('AI_API_URL');
      
      if (!apiUrl) {
        throw new HttpException('AI API URL 未配置', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // 构建 API URL
      const url = new URL('/get-audio', apiUrl);
      url.searchParams.append('text', text);
      url.searchParams.append('voice', voice);
      
      console.log('Requesting TTS:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'audio/mpeg',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('TTS API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: url.toString()
        });
        throw new HttpException(
          `语音生成失败 (${response.status}): ${errorText}`,
          response.status
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) {
        throw new HttpException('返回的音频数据为空', HttpStatus.BAD_GATEWAY);
      }

      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('TTS Service Error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `服务器错误: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 