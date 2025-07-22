    import { PassportStrategy } from "@nestjs/passport";
    import { ExtractJwt, Strategy } from "passport-jwt";
    import { UserService } from "../user/user.service";
import { Injectable } from "@nestjs/common";

    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy){
        constructor (private readonly userService: UserService){
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: 'key'
            });
        }

        async validate(payload:any){
            const email = payload.email;
            const user = await this.userService.findByEmail(email)
            return user
        }
    }