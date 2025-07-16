import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepositoty: Repository<UserEntity>,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.userRepositoty.findOne({
      where: {
        email: dto.email,
      },
    });

    if(user){
        throw new BadGatewayException("Tài khoản đã được đăng kí rồi")
    }
    const newUser = await this.userRepositoty.create({
        email: dto.email,
        name: dto.name,
        password: dto.password
    })
    const hashPassWord = await bcrypt.hash(newUser.password,10)
    newUser.password = hashPassWord
    const saveUser = this.userRepositoty.save(newUser)
    return saveUser
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const name = user.name
    const email = user.email
    const password = user.password
    return {
      name,
      email,
      password,
      access_token: this.jwtService.sign(payload),
    };
  }
}
