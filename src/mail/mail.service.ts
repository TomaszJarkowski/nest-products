import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
    } catch (e) {
      console.error(e);
    }
  }
}
