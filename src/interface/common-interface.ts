export interface ApiProvider {
  getSummary(data: any): Promise<any>;
  getContent(data: any): Promise<any>;
}
