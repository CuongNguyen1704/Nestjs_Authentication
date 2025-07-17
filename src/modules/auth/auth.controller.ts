import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { get, request } from "http";
import { SignUpDto } from "./dto/signup.dto";
import { ProfileDto } from "./dto/profile.dto";


@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService,
                 private readonly userService: UserService,
                 
    ){}

    @Post('/register')
    register (@Body() userData: SignUpDto) {
        return this.authService.signUp(userData);
    }
    @Get('profile')
    profile (@Request() req:any): ProfileDto{
        const {email, name, password} = req.user
        return {email,name,password};
    }

}