import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const status = bcrypt.compareSync(password, user.password);
    console.log(status);
    if (status) {
      return user;
    }
    return null;
  }

  async saveRefreshToken(refres_token: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const hashedRefrehToken = await bcrypt.hash(refres_token, 10); // mã hóa refrestoken
    user.refresh_token = hashedRefrehToken;

    return this.userRepository.save(user);
  }

  async verifyRefreshToken(refres_token: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user && user.refresh_token) {
      const status = await bcrypt.compare(refres_token, user.refresh_token);
      if (status) {
        return user;
      }
    }
    return false
  }
}
