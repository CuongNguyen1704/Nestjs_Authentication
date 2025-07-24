import { IsString } from "class-validator";

export class SendMailDto  {

    @IsString()
    tagert: string

    @IsString()
    content: string

    @IsString()
    subject: string
}