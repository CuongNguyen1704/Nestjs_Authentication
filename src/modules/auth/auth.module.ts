import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModul } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStraegy } from "src/passports/local.trategy";
import { JwtStrategy } from "src/passports/jwt.strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService,LocalStraegy,JwtStrategy],
    imports: [
        UserModul,
        PassportModule,
        JwtModule.register({
            secret: 'key',
            signOptions: {expiresIn: '1h'}
        })
    ]
})
export class AuthModule {

}