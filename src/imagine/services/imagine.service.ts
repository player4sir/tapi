import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImagineDto } from '../dto/imagine.dto';

@Injectable()
export class ImagineService {
  private readonly TEXT_API_BASE = 'https://text.pollinations.ai';

  constructor(private configService: ConfigService) {}

  private async translatePrompt(prompt: string): Promise<string> {
    const response = await fetch(this.TEXT_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an expert at writing Midjourney-style prompts. Convert the input into a detailed, creative prompt that will generate high-quality AI art. Include artistic style, lighting, color, mood, and technical aspects. Keep the response focused and concise. Only return the converted prompt without any explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "openai"
      })
    });

    if (!response.ok) {
      throw new HttpException('提示词转换失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return response.text();
  }

  async generateImage(imagineDto: ImagineDto): Promise<Buffer> {
    try {
      const { prompt, size, model } = imagineDto;
      const seed = Math.floor(Math.random() * 1000000);

      // 转换提示词
      const englishPrompt = await this.translatePrompt(prompt);
      
      const apiUrl = this.configService.get('AI_API_URL');
      if (!apiUrl) {
        throw new HttpException('AI API URL 未配置', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // 生成图片
      const imageUrl = new URL('/imagine', apiUrl);
      imageUrl.searchParams.append('prompt', englishPrompt);
      imageUrl.searchParams.append('size', size);
      imageUrl.searchParams.append('model', model);
      imageUrl.searchParams.append('seed', seed.toString());

      const imageResponse = await fetch(imageUrl.toString(), {
        headers: {
          'Accept': 'image/png',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Origin': apiUrl,
          'Referer': `${apiUrl}/`,
        },
      });

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        throw new HttpException(
          `图片生成失败: ${errorText}`, 
          imageResponse.status
        );
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
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