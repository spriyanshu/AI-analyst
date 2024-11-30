import { Controller, Post, Body } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('send-email')
  async sendEmail(
    @Body() emailData: { to: string; subject: string; text: string },
  ): Promise<void> {
    const { to, subject, text } = emailData;
    try {
      await this.communicationService.sendMail(to, subject, text);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Error while sending email');
    }
  }
}
