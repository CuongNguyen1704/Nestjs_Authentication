import { IsNotEmpty, IsString} from "class-validator";

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsString()

    password: string

    @IsNotEmpty()
    @IsString()
    passwordConfirmation: string

    @IsString()
    @IsNotEmpty()
    token: string
}