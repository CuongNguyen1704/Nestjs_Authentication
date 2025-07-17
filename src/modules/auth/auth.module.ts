import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModul } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UserModul,
        PassportModule,
        JwtModule.register({
            secret: 'key',
            signOptions: {expiresIn: '1h'}
        }),
        TypeOrmModule.forFeature([UserEntity])
    ]
})
export class AuthModule {

}