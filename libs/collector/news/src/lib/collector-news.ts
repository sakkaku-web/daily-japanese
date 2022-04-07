import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DAILY_NEWSPAPER_TABLE,
  DailyNewspaperTableColumn,
  toDayCategoryId,
  Collector,
} from '@sakkaku-web/shared-cloud';
import axios from 'axios';
import { add } from 'date-fns';

const baseURL = 'https://newsapi.org/v2';
const headlinesURL = `${baseURL}/top-headlines`;

const dynamodb = new DynamoDBClient({});

export const handler = async () => {
  const query = new URLSearchParams({
    country: 'jp',
    apiKey: process.env.NEWS_API,
    pageSize: '5',
  });

  try {
    const { data } = await axios.get(`${headlinesURL}?${query.toString()}`);

    const today = new Date();
    const expires = add(today, { days: 3 });

    await dynamodb.send(
      new PutItemCommand({
        TableName: DAILY_NEWSPAPER_TABLE,
        Item: {
          [DailyNewspaperTableColumn.DAY_CATEGORY_ID]: {
            S: toDayCategoryId(today, Collector.NEWS),
          },
          [DailyNewspaperTableColumn.EXPIRES]: { N: `${expires.getTime()}` },
          [DailyNewspaperTableColumn.DATA]: {
            S: JSON.stringify(data.articles),
          },
        },
      })
    );

    return data.articles;
  } catch (err) {
    console.log(err);
    return err;
  }
};
