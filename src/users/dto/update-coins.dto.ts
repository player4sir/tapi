import { IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CoinUpdateType {
  ADD = 'add',
  SUBTRACT = 'subtract'
}

export class UpdateCoinsDto {
  @ApiProperty({
    example: 5,
    description: '要增加或减少的积分数量',
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    example: 'add',
    enum: CoinUpdateType,
    description: '操作类型：add(增加) 或 subtract(减少)'
  })
  @IsEnum(CoinUpdateType)
  type: CoinUpdateType;
} 