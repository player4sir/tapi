import { ApiProperty } from '@nestjs/swagger';

export class LyricLine {
  @ApiProperty({ description: '歌词文本' })
  text: string;

  @ApiProperty({ description: '开始时间(秒)' })
  start: number;

  @ApiProperty({ description: '结束时间(秒)' })
  end: number;
}

export class LyricsData {
  @ApiProperty({ description: '制作信息', type: [String] })
  maker_info: string[];

  @ApiProperty({ description: '歌词数据', type: [LyricLine] })
  lyrics: LyricLine[];
}

export class MusicInfo {
  @ApiProperty({ description: '状态', enum: ['success', 'error'] })
  status: string;

  @ApiProperty({ description: '歌曲标题', required: false })
  title?: string;

  @ApiProperty({ description: '艺术家', required: false })
  artist?: string;

  @ApiProperty({ description: '音轨ID', required: false })
  track_id?: string;

  @ApiProperty({ description: '音频URL', required: false, nullable: true })
  audio_url?: string | null;

  @ApiProperty({ description: '封面URL', required: false, nullable: true })
  cover_url?: string | null;

  @ApiProperty({ description: '歌词数据', required: false, nullable: true })
  lyrics?: LyricsData | null;

  @ApiProperty({ description: '是否为预览版本', required: false })
  is_preview?: boolean;

  @ApiProperty({ description: '时长(秒)', required: false, nullable: true })
  duration?: number | null;

  @ApiProperty({ description: '错误信息', required: false })
  msg?: string;
} 