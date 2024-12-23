import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AudioDto {
  @ApiProperty({
    description: '音频URL (从 /qishui 接口返回的 audio_url)',
    example: 'https://v11-luna.douyinvod.com/xxx/video/tos/cn/...'
  })
  @IsUrl()
  @IsNotEmpty()
  audioUrl: string;
} 