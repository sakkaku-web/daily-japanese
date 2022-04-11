import axios from 'axios';
import { Collector } from '@sakkaku-web/shared-cloud';
import { formatISO } from 'date-fns';

export class NewspaperClient {
  private baseURL = 'https://ctnviqjrwa.execute-api.eu-central-1.amazonaws.com';

  async getNews(): Promise<News[]> {
    return this.getCollectorData<News[]>(Collector.NEWS);
  }

  async getDailyWords(date: Date): Promise<DailyWord[]> {
    return this.getCollectorData<DailyWord[]>(Collector.DAILY_WORD, date);
  }

  private async getCollectorData<T>(
    collector: Collector,
    date: Date = new Date()
  ): Promise<T> {
    return axios
      .get(
        `${this.baseURL}/daily-newspaper/${collector}?date=${formatISO(date, {
          representation: 'date',
        })}`
      )
      .then((x) => x.data);
  }
}

export interface News {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export interface DailyWord {
  word: string;
  reading: string;
  category: string;
}
