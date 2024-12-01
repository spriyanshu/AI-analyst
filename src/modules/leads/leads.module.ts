import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ChatGptProvider } from './providers/gtp.providers';
import { ClaudeProvider } from './providers/claude.provider';

@Module({
  controllers: [LeadsController],
  providers: [
    LeadsService,
    ChatGptProvider,
    ClaudeProvider,
    {
      provide: 'API_PROVIDER',
      useFactory: (
        chatGptProvider: ChatGptProvider,
        claudeProvider: ClaudeProvider,
      ) => {
        return [chatGptProvider, claudeProvider];
      },
      inject: [ChatGptProvider, ClaudeProvider],
    },
  ],
})
export class LeadsModule {}
