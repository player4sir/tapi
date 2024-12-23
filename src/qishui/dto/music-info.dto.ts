import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MusicInfoDto {
  @ApiProperty({
    description: '汽水音乐分享链接',
    example: 'https://qishui.douyin.com/s/XXXXXXXX'
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
} 