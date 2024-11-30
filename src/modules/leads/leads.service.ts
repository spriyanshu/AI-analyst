import { Injectable, Inject } from '@nestjs/common';
import { ApiProvider } from 'src/interface/common-interface';

@Injectable()
export class LeadsService {
  constructor(
    @Inject('API_PROVIDER')
    private readonly apiProvider: ApiProvider[],
  ) {}

  /**
   * Retrieves a summary based on the provided model and data.
   *
   * @param model - The name of the provider to be used for fetching the summary.
   * @param data - The data to be passed to the provider's getSummary method.
   * @returns A promise that resolves with the summary information.
   * @throws Error if there is an issue fetching the lead summary.
   */
  async getSummary(model: string, data: any): Promise<any> {
    try {
      const provider = this.getProvider(model);
      return await provider.getSummary(data);
    } catch (error) {
      throw new Error('Error fetching lead summary');
    }
  }

  /**
   * Retrieves content based on the provided model type and data.
   *
   * @param model - The name of the provider to be used for fetching the content.
   * @param data - The data to be passed to the provider's getContent method.
   * @returns A promise that resolves with the content in string format.
   * @throws Error if there is an issue fetching content for the given type.
   */
  async getContent(model: string, data: any): Promise<string> {
    try {
      const provider = this.getProvider(model);
      return await provider.getContent(data);
    } catch (error) {
      throw new Error(
        error.message || 'Error fetching content for the given type',
      );
    }
  }

  /**
   * Gets a provider by its model name.
   *
   * @param model - The name of the provider to retrieve.
   * @returns The provider matching the given model name.
   * @throws Error if no provider is found with the specified model name.
   */
  private getProvider(providerName: string): ApiProvider {
    const normalizedProviderName = providerName.toLowerCase();
    const provider = this.apiProvider.find(
      (p) => p.constructor.name.toLowerCase() === normalizedProviderName,
    );
    // const normalizedProviderName = providerName.toLowerCase();

    if (!provider) {
      throw new Error(`No provider found with the name ${providerName}`);
    }
    return provider;
  }
}
