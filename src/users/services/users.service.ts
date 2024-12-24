import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async register(createUserDto: CreateUserDto) {
    const { device_id, platform, device_info } = createUserDto;
    
    // 检查设备ID是否已存在
    const existingUserResult = await this.getProfile(device_id);
    if (existingUserResult.success && existingUserResult.data) {
      console.log('Device exists:', existingUserResult.data);
      return {
        success: true,
        data: {
          user: existingUserResult.data,
          isNewUser: false
        }
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
          device_info,
          coins: 20,
        }
      ])
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return {
        success: false,
        error: {
          message: profileError.message,
          code: 'PROFILE_CREATION_ERROR'
        }
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: newUser.id,
          device_id: newUser.device_id,
          platform: newUser.platform,
          coins: newUser.coins,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        },
        isNewUser: true
      }
    };
  }

  async getProfile(deviceId: string) {
    const { data: user, error } = await this.supabaseService.getClient()
      .from('profiles')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        device_id: user.device_id,
        platform: user.platform,
        coins: user.coins,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };
  }

  async updateCoins(deviceId: string, amount: number, type: 'add' | 'subtract') {
    // 先获取用户信息
    const userResult = await this.getProfile(deviceId);
    if (!userResult.success) {
      return userResult;
    }

    const currentCoins = userResult.data.coins;
    const newCoins = type === 'add' ? currentCoins + amount : currentCoins - amount;

    // 检查积分是否足够（如果是减少积分的情况）
    if (type === 'subtract' && newCoins < 0) {
      return {
        success: false,
        error: {
          message: 'Insufficient coins',
          code: 'INSUFFICIENT_COINS'
        }
      };
    }

    // 更新积分
    const { data: updatedUser, error } = await this.supabaseService.getClient()
      .from('profiles')
      .update({ coins: newCoins })
      .eq('device_id', deviceId)
      .select()
      .single();

    if (error) {
      console.error('Coins update error:', error);
      return {
        success: false,
        error: {
          message: error.message,
          code: 'COINS_UPDATE_ERROR'
        }
      };
    }

    return {
      success: true,
      data: {
        id: updatedUser.id,
        device_id: updatedUser.device_id,
        platform: updatedUser.platform,
        model: updatedUser.model,
        coins: updatedUser.coins,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    };
  }
} 