import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios'
}

export class CreateUserDto {
  @ApiProperty({ 
    example: 'device_xxxxxxxxxxxx', 
    description: '设备唯一标识'
  })
  @IsString()
  @IsNotEmpty()
  device_id: string;

  @ApiProperty({ 
    example: 'android',
    enum: Platform,
    description: '平台类型'
  })
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;

  @ApiProperty({ 
    example: 'SM-G9860', 
    description: '设备型号',
    required: false
  })
  @IsString()
  @IsOptional()
  model?: string;
} 