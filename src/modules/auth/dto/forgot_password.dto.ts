import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPassWorDto {
    @IsNotEmpty()
    @IsString()
    email: string
}