import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { QishuiParserService } from '../services/qishui-parser.service';
import { MusicInfo } from '../interfaces/music.interface';
import { MusicInfoDto } from '../dto/music-info.dto';

@ApiTags('汽水音乐')
@ApiSecurity('x-api-key')
@Controller('qishui')
export class QishuiController {
  constructor(private readonly qishuiParserService: QishuiParserService) {}

  @Get()
  @ApiOperation({ 
    summary: '获取音乐信息', 
    description: '解析汽水音乐分享链接获取音乐详情，包含音频URL、歌词等信息' 
  })
  @ApiResponse({ status: 200, description: '成功', type: MusicInfo })
  @ApiResponse({ status: 401, description: 'API Key 无效' })
  async getMusicInfo(@Query() query: MusicInfoDto): Promise<MusicInfo> {
    return await this.qishuiParserService.getMusicInfo(query.url);
  }
} 