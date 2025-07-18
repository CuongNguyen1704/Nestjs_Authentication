import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

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
    // const hashPassWord = await bcrypt.hash(newUser.password,10)
    // newUser.password = hashPassWord
    const saveUser = this.userRepositoty.save(newUser)
    return saveUser
  }

  login(user: any){
    // console.log("user",user)
      const payload = {email: user.email, sub: user.id}
      const refres_token = this.jwtService.sign(payload,{
        expiresIn: "7d"
      })

      this.userService.saveRefreshToken(refres_token,user.id)
      return {
        user,
        access_token: this.jwtService.sign(payload),
        refres_token: refres_token
        
      }
      
  }

  async verifiyRefresToken( refres_token: string){
    const veryfiyRT = await this.jwtService.verifyAsync(refres_token,{secret:"key"})
    // console.log("verify11",veryfiyRT)
    if(veryfiyRT){
       const user = await this.userService.verifyRefreshToken(refres_token,veryfiyRT.sub);
       if(user){
            return user
       }

    }
    return false
  }


}
