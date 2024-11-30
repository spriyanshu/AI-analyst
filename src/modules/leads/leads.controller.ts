import { LeadsService } from './leads.service';
import {
  Controller,
  Post,
  Headers,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

/**
 * Interface for lead data to ensure type safety
 */

/**
 * Controller responsible for managing lead-related operations
 * Provides endpoints for retrieving lead summaries and content
 */
@ApiTags('Leads Management')
@Controller('leads')
export class LeadsController {
  private readonly logger = new Logger(LeadsController.name);

  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Endpoint to fetch a summary of lead data
   * @param model - The type of summary model to use
   * @param data - Comprehensive lead information
   * @returns Lead summary based on the specified model
   */
  @Post('summary')
  @ApiOperation({
    summary: 'Generate a comprehensive lead summary',
    description:
      'Retrieves and analyzes detailed information about a potential lead, ' +
      'providing insights based on the specified analysis model.',
  })
  @ApiHeader({
    name: 'model',
    description:
      'Specifies the analytical model for generating the lead summary. ' +
      'Different models may provide varying depths of insights.',
    required: true,
    example: 'detailed-analysis | quick-overview | industry-specific',
  })
  @ApiBody({
    description: 'Comprehensive lead data for summary generation',
    schema: {
      type: 'object',
      example: {
        lead_id: '123456',
        contact_name: 'John Doe',
        job_title: 'CTO',
        company_name: 'Tech Solutions Inc.',
        company_size: '51-200 employees',
        industry: 'Software Development',
        email: 'john.doe@techsolutions.com',
        phone: '+1-555-123-4567',
        website: 'https://www.techsolutions.com',
        location: {
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
        },
        source: 'LinkedIn',
        lead_status: 'New',
        interested_services: [
          'Custom Software Development',
          'Cloud Migration',
          'IT Consulting',
        ],
        estimated_budget: '$50,000 - $100,000',
        preferred_contact_method: 'Email',
        notes:
          'Looking to migrate legacy systems to cloud within the next quarter.',
        created_at: '2024-11-30T14:15:00Z',
        last_contacted_at: null,
        next_follow_up_date: '2024-12-07',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully generated lead summary with in-depth insights',
    schema: {
      example: {
        summary:
          'Detailed analysis of lead potential, key challenges, and opportunities',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or missing required parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during lead summary generation',
  })
  async getSummary(@Headers('model') model: string, @Body() data: any) {
    try {
      // Validate the model parameter
      if (!model) {
        this.logger.warn(
          'Attempt to generate summary without specifying a model',
        );
        throw new HttpException(
          'Analysis model is required for summary generation',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate input data
      // this.validateLeadData(data);

      // Generate and return lead summary
      const summary = await this.leadsService.getSummary(model, data);

      this.logger.log(
        `Successfully generated summary for ${data.contactName} using ${model} model`,
      );
      return summary;
    } catch (error) {
      this.logger.error(
        `Failed to generate lead summary: ${error.message}`,
        error.stack,
      );

      // Differentiate between validation and internal errors
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Unexpected error occurred while generating lead summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('get-content')
  @ApiOperation({
    summary: 'Fetch content based on the provided type and request body',
    description:
      'This endpoint retrieves specific content based on the "model" header and the provided request body data.',
  })
  @ApiHeader({
    name: 'model',
    description:
      'Specifies the analytical model for generating the lead summary. ' +
      'Different models may provide varying depths of insights.',
    required: true,
    example: 'detailed-analysis | quick-overview | industry-specific',
  })
  @ApiBody({
    description: 'Request payload containing lead information',
    schema: {
      type: 'object',
      properties: {
        content_type: {
          type: 'string',
          enum: ['chatgpt', 'personalized', 'cold', 'outreach'],
          example: 'chatgpt',
        },
        lead: {
          type: 'object',
          properties: {},
          required: ['lead_id', 'contact_name', 'job_title'],
        },
        representative: {
          type: 'object',
          properties: {},
        },
      },
      required: ['content_type', 'lead'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Content successfully fetched',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        type: { type: 'string' },
        embedding: { type: 'array', items: { type: 'number' } },
        metadata: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request due to missing or invalid parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getContent(
    @Headers('model') model: string,
    @Body() body: { content_type: string; lead: any; representative: any },
  ) {
    try {
      // Validate model header
      if (!model) {
        this.logger.warn('Model header is missing');
        throw new HttpException(
          'The "model" header is required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate request body
      if (!body) {
        throw new HttpException(
          'Request body cannot be empty',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate content type
      const validContentTypes = [
        'personalized-email',
        'cold-email',
        'outreach',
        'proposal-email',
        'offer-email',
      ];
      // if (
      //   !body.content_type ||
      //   !validContentTypes.includes(body.content_type)
      // ) {
      //   throw new HttpException(
      //     `Invalid content type. Must be one of: ${validContentTypes.join(', ')}`,
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // Validate lead information
      // if (!body.lead || !body.lead.lead_id || !body.lead.contact_name) {
      //   throw new HttpException(
      //     'Lead information is incomplete. lead_id and contact_name are required.',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      // Prepare data for content generation
      // const contentData = {
      //   personal_info: {
      //     full_name: body.lead.contact_name,
      //     job_title: body.lead.job_title,
      //     company: body.lead.company_name,
      //     email: body.lead.email,
      //   },
      //   professional_interests: {
      //     focus_areas: body.lead.interested_services || [],
      //   },
      //   company_context: {
      //     current_projects: body.lead.notes ? [body.lead.notes] : [],
      //   },
      //   technical_expertise: {
      //     primary_technologies: [],
      //   },
      // };

      // Fetch content from the service
      const content = await this.leadsService.getContent(model, body);

      this.logger.log(`Content fetched successfully for model: ${model}`);
      return content;
    } catch (error) {
      // Log the error details for debugging
      this.logger.error(
        `Error fetching content for model: ${model}`,
        error.stack,
      );

      // Handle specific types of errors
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle specific error scenarios
      if (error.message.includes('Unsupported content type')) {
        throw new HttpException(
          'The requested content type is not supported.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generic error handler
      throw new HttpException(
        'An unexpected error occurred while fetching content.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
