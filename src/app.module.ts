import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { LeadsModule } from './modules/leads/leads.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { AppController } from './app.controller';

@Module({
  imports: [LeadsModule, CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
