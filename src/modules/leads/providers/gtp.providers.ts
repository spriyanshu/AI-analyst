import { Injectable } from '@nestjs/common';
import { ApiProvider } from 'src/interface/common-interface';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'jsonc-parser'; // This handles JSON with comments if needed

// Define the structure of your config
interface EmailTemplate {
  systemRole: string;
  promptTemplate: string;
}

interface WhatsAppTemplate {
  systemRole: string;
  promptTemplate: string;
}

interface SummaryTemplate {
  systemRole: string;
  promptTemplate: string;
}

interface Config {
  apiKey: string;
  model: string;
  embeddingsModel: string;
  emailTemplate: EmailTemplate;
  whatsappTemplate: WhatsAppTemplate;
  summaryTemplate: SummaryTemplate;
}

const configPath = path.join(process.cwd(), '/src/config/config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
const config: Config = JSON.parse(rawConfig);
@Injectable()
export class ChatGptProvider implements ApiProvider {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async preprocessDataForEmbedding(data: any): Promise<string> {
    try {
      const stringifiedData = JSON.stringify(data);
      const embeddings = await this.generateEmbeddings(stringifiedData);

      return JSON.stringify({
        ...data,
        embedding: embeddings,
      });
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error('Embedding generation failed');
    }
  }

  private async createChatCompletion(
    systemContent: string,
    userPrompt: string,
    maxTokens: number,
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content.trim();
  }

  async getSummary(data: any): Promise<any> {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid input: Expected JSON object');
      }

      const embedding = {
        values: data,
        template: config.summaryTemplate.promptTemplate,
      };
      console.log('step-44', embedding);
      const prompt = await this.preprocessDataForEmbedding(embedding);
      const leadSummary = await this.createChatCompletion(
        config.summaryTemplate.systemRole,
        prompt,
        4000,
      );

      return {
        responseFormat: {
          requestType: 'summary',
          leadSummary: parse(leadSummary),
          metadata: {
            source: 'ChatGptProvider',
            timestamp: new Date(),
            embeddingGenerated: true,
          },
        },
      };
    } catch (error) {
      console.error('Summary generation failed:', error);
      return this.createErrorResponse(data, 'summary', error);
    }
  }

  async getContent(data: any): Promise<any> {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid input: Expected JSON object');
      }

      const normalizedType = data.content_type.toLowerCase().replace(/-/g, ' ');
      let content: string;

      switch (normalizedType) {
        case 'personalized email content':
          content = await this.generatePersonalizedEmail(data);
          break;
        case 'whatsapp message content':
          content = await this.generateWhatsAppMessage(data);
          break;
        default:
          throw new Error(`Unsupported content type: ${data.content_type}`);
      }

      return this.createResponse(content, normalizedType);
    } catch (error) {
      console.error('Content retrieval failed:', error);
      return this.createErrorResponse(data, 'content', error);
    }
  }

  private async generatePersonalizedEmail(data: any): Promise<string> {
    const embedding = {
      values: data.lead,
      representative: data.representative,
      template: config.emailTemplate.promptTemplate,
    };
    console.log('step-111', embedding);
    const prompt = await this.preprocessDataForEmbedding(embedding);
    console.log(`Generating personalized email embedding`, { prompt });

    const response = this.createChatCompletion(
      config.emailTemplate.systemRole,
      prompt,
      300,
    );
    return response;
  }

  private async generateWhatsAppMessage(data: any): Promise<string> {
    const embedding = {
      values: data.lead,
      representative: data.representative,
      template: config.emailTemplate.promptTemplate,
    };
    const prompt = await this.preprocessDataForEmbedding(embedding);
    return this.createChatCompletion(
      config.whatsappTemplate.systemRole,
      prompt,
      150,
    );
  }

  private async generateEmbeddings(data: string): Promise<number[]> {
    try {
      const embeddingResponse = await this.openai.embeddings.create({
        model: config.embeddingsModel,
        input: data,
      });
      return embeddingResponse.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return [];
    }
  }

  private createResponse(content: string, type: string) {
    return {
      responseFormat: {
        content,
        type,
        metadata: {
          source: 'ChatGptProvider',
          timestamp: new Date(),
        },
      },
    };
  }

  private createErrorResponse(data: any, requestType: string, error: Error) {
    return {
      originalContent: data,
      processedContent: null,
      metadata: {
        source: 'ChatGptProvider',
        requestType,
        error: error.message,
        timestamp: new Date(),
      },
    };
  }
}
