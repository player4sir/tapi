import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 排除 auth 路由
    if (request.path.startsWith('/auth')) {
      return true;
    }

    const apiKey = request.headers['x-api-key'];
    const userAgent = request.headers['user-agent'];

    // 检查是否提供了 API Key
    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    // 验证 API Key
    if (apiKey !== this.configService.get<string>('apiKey')) {
      console.warn(`Invalid API key attempt from ${request.ip}`);
      throw new UnauthorizedException('Invalid API key');
    }

    // 可选：记录访问日志
    console.log(`API accessed by ${request.ip} using ${userAgent}`);

    return true;
  }
} 