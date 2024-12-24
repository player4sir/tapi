import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { device_id, platform, model } = createUserDto;
      
      // 检查设备ID是否已存在
      const { data: existingUser } = await this.supabaseService.getClient()
        .from('profiles')
        .select('*')
        .eq('device_id', device_id)
        .single();

      // 如果用户已存在，直接返回用户信息
      if (existingUser) {
        console.log('Device exists:', existingUser);
        return {
          user: {
            id: existingUser.id,
            device_id: existingUser.device_id,
            platform: existingUser.platform,
            model: existingUser.model,
            coins: existingUser.coins,
          },
          isNewUser: false
        };
      }

      // 如果用户不存在，创建新用户
      console.log('Creating new device profile:', device_id);

      // 创建用户资料
      const { data: newUser, error: profileError } = await this.supabaseService.getClient()
        .from('profiles')
        .insert([
          {
            device_id,
            platform,
            model,
            coins: 20,
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new UnauthorizedException(profileError.message);
      }

      return {
        user: {
          id: newUser.id,
          device_id: newUser.device_id,
          platform: newUser.platform,
          model: newUser.model,
          coins: newUser.coins,
        },
        isNewUser: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new UnauthorizedException(error.message);
    }
  }
} 