import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendMailDto } from "./dto/send-email.dto";

@Injectable()
export class MailService {
    constructor (private readonly mailerService: MailerService){}

    async send(dto: SendMailDto){
        await this.mailerService.sendMail({
            to: dto.tagert,
            subject: dto.subject,
            html: dto.content
        })
        return {data: true}
    }
}