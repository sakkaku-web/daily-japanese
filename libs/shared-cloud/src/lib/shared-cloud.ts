import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { add, format } from 'date-fns';

export const DAILY_NEWSPAPER_TABLE = 'DailyNewspaper';
export enum DailyNewspaperTableColumn {
  DAY_CATEGORY_ID = 'dayCategory',
  EXPIRES = 'expires',
  DATA = 'data',
}

export enum Collector {
  NEWS = 'news',
  DAILY_WORD = 'daily-word',
}

export function toDayCategoryId(
  date: Date,
  collector: Collector | string
): string {
  return `${format(date, 'yyyyMMdd')}#${collector}`;
}

export function saveCollectorData(
  collector: Collector,
  data: any
): Promise<any> {
  const today = new Date();
  const expires = add(today, { days: 3 });

  const dynamodb = new DynamoDBClient({});
  return dynamodb.send(
    new PutItemCommand({
      TableName: DAILY_NEWSPAPER_TABLE,
      Item: {
        [DailyNewspaperTableColumn.DAY_CATEGORY_ID]: {
          S: toDayCategoryId(today, collector),
        },
        [DailyNewspaperTableColumn.EXPIRES]: {
          N: `${expires.getTime() / 1000}`,
        },
        [DailyNewspaperTableColumn.DATA]: {
          S: JSON.stringify(data),
        },
      },
    })
  );
}
