import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log('Configured API Key:', configService.get('apiKey'));

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('汽水音乐 API')
    .setDescription('汽水音乐解析服务 API 文档')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: '汽水音乐 API 文档',
    customfavIcon: 'https://swagger.io/favicon.png',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  // 基本安全头
  app.use(helmet({
    contentSecurityPolicy: false, // 为了让 Swagger UI 正常工作
  }));
  
  // 输入验证
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 严格的 CORS 配置
  app.enableCors({
    origin: configService.get('cors.origin'),
    methods: configService.get('cors.methods'),
    credentials: true,
    allowedHeaders: ['content-type', 'x-api-key'],
  });

  await app.listen(configService.get('port'));
}
bootstrap(); 