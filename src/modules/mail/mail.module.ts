import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async(configService: ConfigService)=> ({
          transport: {
            host: configService.get('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            auth:{
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_APP_PASSWORD')
            }
          },
          defaults: {
            from: '"No Reply <noreply@example.com"',
          }
      })
    })
  ],
  providers: [MailService],
  controllers: [],
  exports: [MailService],
})
export class MailModule {}
