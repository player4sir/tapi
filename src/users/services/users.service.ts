import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { uuid } = createUserDto;
      
      // 检查UUID是否已存在
      const { data: existingUser } = await this.supabaseService.getClient()
        .from('profiles')
        .select('*')
        .eq('id', uuid)
        .single();

      // 如果用户已存在，直接返回用户信息
      if (existingUser) {
        console.log('User exists:', existingUser);
        return {
          user: {
            id: existingUser.id,
            coins: existingUser.coins,
          },
          isNewUser: false
        };
      }

      // 如果用户不存在，创建新用户
      console.log('Creating new user:', uuid);

      // 创建用户资料
      const { error: profileError } = await this.supabaseService.getClient()
        .from('profiles')
        .insert([
          {
            id: uuid,
            coins: 20,
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new UnauthorizedException(profileError.message);
      }

      return {
        user: {
          id: uuid,
          coins: 20,
        },
        isNewUser: true
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new UnauthorizedException(error.message);
    }
  }
} 