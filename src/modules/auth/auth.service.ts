import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { access } from "fs";

@Injectable()
export class AuthService {
    constructor (private readonly userService: UserService,
                 private readonly jwtService: JwtService
    ){}

    async login(user:any){
        const payload = {email: user.email, sub: user.id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}