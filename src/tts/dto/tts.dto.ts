import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TTSDto {
  @ApiProperty({
    description: '要转换的文字内容',
    example: '你好，世界！'
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: '语音类型',
    example: 'alex',
    enum: ['alex', 'sophia'],
    default: 'alex'
  })
  @IsString()
  @IsIn(['alex', 'sophia'])
  voice: string;
} 