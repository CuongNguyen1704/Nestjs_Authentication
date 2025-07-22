import { IsNotEmpty, IsString } from "class-validator";

export class RefresTokenDto {

    @IsString()
    @IsNotEmpty()
    refreshToken: string
}