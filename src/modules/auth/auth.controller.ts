import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { get, request } from "http";
import { SignUpDto } from "./dto/signup.dto";
import { ProfileDto } from "./dto/profile.dto";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";


@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService,
                 private readonly userService: UserService,
                 
    ){}

    @Post('/register')
    register (@Body() userData: SignUpDto) {
        return this.authService.signUp(userData);
    }
    @UseGuards(LocalAuthGuard)
    @Post('/login') 
    login(@Request() req:any){
        return this.authService.login(req.user)
    }
    @Post('refresh_token')
   async refreshToken (@Body() {refreshToken}: {refreshToken: string}) {
        if(!refreshToken){
            throw new BadRequestException("RefresToken is required")
        }
        const user = await this.authService.verifiyRefresToken(refreshToken)
        if(!user){
            throw new BadRequestException("Invalid refresh token")
        }
        return this.authService.login(user)
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile (@Request() req:any): ProfileDto{
        const {email, name, password} = req.user
        return {email,name,password};
    }

}