import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ChatGptProvider } from './providers/gtp.providers';

@Module({
  controllers: [LeadsController],
  providers: [
    LeadsService,
    ChatGptProvider,
    {
      provide: 'API_PROVIDER',
      useFactory: (chatGptProvider: ChatGptProvider) => {
        return [chatGptProvider];
      },
      inject: [ChatGptProvider],
    },
  ],
})
export class LeadsModule {}
