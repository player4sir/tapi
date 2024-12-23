import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { QishuiModule } from './qishui/qishui.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import configuration from './config/configuration';
import { ImagineModule } from './imagine/imagine.module';
import { TTSModule } from './tts/tts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    QishuiModule,
    ImagineModule,
    TTSModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {} 