import axios from 'axios';
import { Collector } from '@sakkaku-web/shared-cloud';

export class NewspaperClient {
  private baseURL = 'https://ctnviqjrwa.execute-api.eu-central-1.amazonaws.com';

  async getNews(): Promise<News[]> {
    return this.getCollectorData<News[]>(Collector.NEWS);
  }

  private async getCollectorData<T>(collector: Collector): Promise<T> {
    return axios
      .get(`${this.baseURL}/daily-newspaper/${collector}`)
      .then((x) => JSON.parse(x.data));
  }
}

export interface News {
  source: { id: string; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
