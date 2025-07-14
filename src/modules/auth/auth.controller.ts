import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { get, request } from "http";
import { LocalAuthGuard } from "src/guards/local-auth.guard";
import { jwtAuthGuard } from "src/guards/jwt-auth.guard";


@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService,
                 private readonly userService: UserService
    ){}

    @Post('/register')
    register (@Body() userData: any) {
        return this.userService.createUser(userData);
    }
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() request: any) {
        return this.authService.login(request.user)
        // const {email= '',password = ''} = dataLogin
        // return this.userService.validateUser(email,password)
    }

    @UseGuards(jwtAuthGuard)
    @Get('profile')
    profile (@Request() req:any){
        console.log(req)
        return req.user;
    }

}