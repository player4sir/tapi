import { IsString, IsNotEmpty, IsEnum, IsObject, Length, Matches, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios'
}

export class DeviceInfoDto {
  @ApiProperty({ example: 'Samsung' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Galaxy S21' })
  @IsString()
  device: string;

  @ApiProperty({ example: 'SM-G991B' })
  @IsString()
  model: string;

  @ApiProperty({ example: '13' })
  @IsString()
  version: string;

  @ApiProperty({ example: 33 })
  @IsNumber()
  sdk: number;
}

export class CreateUserDto {
  @ApiProperty({ 
    example: '123456',
    description: '6位数字设备ID',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]{6}$'
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^[0-9]{6}$/, { message: 'device_id must be 6 digits' })
  device_id: string;

  @ApiProperty({ 
    example: 'android',
    enum: Platform,
    description: '平台类型: android/ios'
  })
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;

  @ApiProperty({
    example: {
      brand: 'Samsung',
      device: 'Galaxy S21',
      model: 'SM-G991B',
      version: '13',
      sdk: 33
    },
    description: '设备详细信息',
    type: DeviceInfoDto
  })
  @IsObject()
  device_info: DeviceInfoDto;
} 