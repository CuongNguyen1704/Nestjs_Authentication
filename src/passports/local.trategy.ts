import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import  {Strategy} from "passport-local";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class LocalStraegy extends PassportStrategy(Strategy) {
    constructor (private readonly userService: UserService){
        super({usernameField: 'email'});
    }

    async validate(email: string, password: string) {
        const user = await this.userService.validateUser(email,password);
        if(!user){
            throw new UnauthorizedException('Invalid Creadentials')
        }
        return  user
    }
      
}