import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ApiTags('用户')
@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ 
    summary: '注册/获取用户', 
    description: '基于设备UUID注册或获取用户信息' 
  })
  @ApiResponse({ status: 201, description: '成功' })
  @ApiResponse({ status: 400, description: '无效的UUID' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.register(createUserDto);
  }
} 