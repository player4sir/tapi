import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImagineDto {
  @ApiProperty({
    description: '绘图提示词',
    example: '一只可爱的猫咪'
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: '图片尺寸比例',
    example: '1:1',
    enum: ['1:1', '16:9', '9:16', '21:9', '9:21', '1:2', '2:1'],
    default: '1:1'
  })
  @IsString()
  @IsOptional()
  @IsIn(['1:1', '16:9', '9:16', '21:9', '9:21', '1:2', '2:1'])
  size?: string = '1:1';

  @ApiProperty({
    description: 'AI模型',
    example: 'flux',
    enum: [
      'flux',
      'flux-realism',
      'flux-4o',
      'flux-pixel',
      'flux-3d',
      'flux-anime',
      'flux-disney',
      'any-dark',
      'stable-diffusion-xl-lightning',
      'stable-diffusion-xl-base'
    ],
    default: 'flux'
  })
  @IsString()
  @IsOptional()
  @IsIn([
    'flux',
    'flux-realism',
    'flux-4o',
    'flux-pixel',
    'flux-3d',
    'flux-anime',
    'flux-disney',
    'any-dark',
    'stable-diffusion-xl-lightning',
    'stable-diffusion-xl-base'
  ])
  model?: string = 'flux';
} 