import { Controller, Post, Body, Header, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';
import { ImagineService } from '../services/imagine.service';
import { ImagineDto } from '../dto/imagine.dto';

@ApiTags('AI绘图')
@ApiSecurity('x-api-key')
@Controller('imagine')
export class ImagineController {
  constructor(private readonly imagineService: ImagineService) {}

  @Post()
  @ApiOperation({ summary: 'AI绘图', description: '根据提示词生成AI图片' })
  @ApiResponse({ status: 200, description: '成功 - 返回图片' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 401, description: 'API Key 无效' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async generateImage(
    @Body() imagineDto: ImagineDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      const imageBuffer = await this.imagineService.generateImage(imagineDto);
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
        'Cache-Control': 'public, max-age=31536000'
      });
      
      res.end(imageBuffer);
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: error.message || '图片生成失败'
      });
    }
  }
} 