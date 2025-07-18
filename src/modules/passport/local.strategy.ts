import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "../user/user.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UserService){
        super({usernameField: 'email'});
    }
    
   async validate(email: string, password: string) {
        const user = await this.userService.validateUser(email,password)
        if(!user){
          throw new  BadRequestException('Người dùng này không tồn tại')
        }
        return user
    }
}