import { Controller, Post, Get, Body, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateCoinsDto } from '../dto/update-coins.dto';

@ApiTags('用户')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ 
    summary: '注册/获取用户', 
    description: '基于设备ID注册或获取用户信息' 
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-string' },
                device_id: { type: 'string', example: 'device_xxxxxxxxxxxx' },
                platform: { type: 'string', example: 'android' },
                model: { type: 'string', example: 'SM-G9860' },
                coins: { type: 'number', example: 20 },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
              }
            },
            isNewUser: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '错误', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Profile creation error' },
            code: { type: 'string', example: 'PROFILE_CREATION_ERROR' }
          }
        }
      }
    }
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }

  @Get('profile')
  @ApiOperation({
    summary: '获取用户信息',
    description: '根据设备ID获取用户信息'
  })
  @ApiQuery({ 
    name: 'device_id', 
    required: true, 
    description: '设备唯一标识',
    example: 'device_xxxxxxxxxxxx'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            device_id: { type: 'string', example: 'device_xxxxxxxxxxxx' },
            platform: { type: 'string', example: 'android' },
            model: { type: 'string', example: 'SM-G9860' },
            coins: { type: 'number', example: 20 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: '用户不存在', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User not found' },
            code: { type: 'string', example: 'USER_NOT_FOUND' }
          }
        }
      }
    }
  })
  async getProfile(@Query('device_id') deviceId: string) {
    return await this.usersService.getProfile(deviceId);
  }

  @Put('coins')
  @ApiOperation({
    summary: '更新用户积分',
    description: '增加或减少用户的积分'
  })
  @ApiQuery({ 
    name: 'device_id', 
    required: true, 
    description: '设备唯一标识',
    example: 'device_xxxxxxxxxxxx'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-string' },
            device_id: { type: 'string', example: 'device_xxxxxxxxxxxx' },
            platform: { type: 'string', example: 'android' },
            model: { type: 'string', example: 'SM-G9860' },
            coins: { type: 'number', example: 25 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: '错误', 
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Insufficient coins' },
            code: { type: 'string', example: 'INSUFFICIENT_COINS' }
          }
        }
      }
    }
  })
  async updateCoins(
    @Query('device_id') deviceId: string,
    @Body() updateCoinsDto: UpdateCoinsDto
  ) {
    return await this.usersService.updateCoins(
      deviceId,
      updateCoinsDto.amount,
      updateCoinsDto.type
    );
  }
} 