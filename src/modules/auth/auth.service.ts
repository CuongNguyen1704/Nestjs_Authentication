import { BadGatewayException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { SignUpDto } from './dto/signup.dto';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { ForgotPassWorDto } from './dto/forgot_password.dto';
import * as crypto from 'crypto';
import buildEmailTemplate from 'src/util/buil-email-template';
import { templateEmailForgotpassword } from './template/forgot-password';
import { SendMailDto } from '../mail/dto/send-email.dto';
import { MailService } from '../mail/mail.service';
import * as dayjs from 'dayjs';
import { ResetPasswordDto } from './dto/reset-pass-word.dto';
import { threadId } from 'worker_threads';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepositoty: Repository<UserEntity>,
    private readonly mailService: MailService
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

  login(user: UserEntity){
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

  async forgotPassword(forgotPassword: ForgotPassWorDto) {
      const oldUser = await this.userRepositoty.findOne({
        where: {
            email: forgotPassword.email
        }
      })
      if(!oldUser){
        throw new NotFoundException("Tài khoản này chưa được đăng kí")
      }
      const tokenReset = crypto.randomBytes(64).toString('hex')
      const teamplateString  = buildEmailTemplate(templateEmailForgotpassword,{
        number: tokenReset 
      })

      const data: SendMailDto = {
          tagert: forgotPassword.email,
          content: teamplateString,
          subject: `Mạnh Cường forgotpassword`
      }

      await this.mailService.send(data)

      const forgotPasswordExpireAt = dayjs().add(10,'minutes').toDate();

      await this.userRepositoty.update(
        {email: forgotPassword.email},
        {
          forgotPasswordExpireAt,
          forgotPasswordToken: tokenReset
        }
      )
      return true
      

  }

  async resetPassword(resetPassword: ResetPasswordDto){
    const {password,passwordConfirmation,token} = resetPassword

    if(password !== passwordConfirmation){
      throw new BadGatewayException('Passwords do not match')
    }

    const user = await this.userRepositoty.findOne({
      where: {
        forgotPasswordToken: token
      }
    })
    if(!user){
      throw new BadGatewayException("Token Invalid")
    }

    const currentTime = dayjs()
    if(currentTime.isAfter(user.forgotPasswordExpireAt)){
      throw new BadGatewayException("The password reset code has expired")
    }
    await this.userRepositoty.update(user.id,{
        forgotPasswordToken: null,
        password: await bcrypt.hash(password,10)
    })
    return true
  }


}
