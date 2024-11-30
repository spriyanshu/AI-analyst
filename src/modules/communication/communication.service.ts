import { Injectable } from '@nestjs/common';
import { EmailService } from './providers/email.service';

@Injectable()
export class CommunicationService {
  constructor(private readonly emailService: EmailService) {}

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.emailService.sendEmail(to, subject, text);
      console.log('Mail sent successfully');
    } catch (error) {
      console.error('An error occurred while sending mail:', error);
      throw new Error('Failed to send email');
    }
  }
}
