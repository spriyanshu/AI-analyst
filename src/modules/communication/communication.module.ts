import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { EmailService } from './providers/email.service';
import { CommunicationController } from './communication.controller';

@Module({
  providers: [CommunicationService, EmailService],
  controllers: [CommunicationController],
  exports: [CommunicationService],
})
export class CommunicationModule {}
