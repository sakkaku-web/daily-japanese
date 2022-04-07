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

enum Categories {}
// BUSINESS = 'business',
// ENTERTAINMENT = 'entertainment',
// GENERAL = 'general',
// HEALTH = 'health',
// SCIENCE = 'science',
// SPORTS = 'sports',
// TECHNOLOGY = 'technology',

function searchForCategory(category: string): Promise<any[]> {
  const query = new URLSearchParams({
    country: 'jp',
    apiKey: process.env.NEWS_API,
    pageSize: '5',
    // category,
  });
  return axios.get(`${headlinesURL}?${query.toString()}`).then((res) => {
    return res.data.articles.map((article) => ({
      // author: article.author,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      // category,
    }));
  });
}

export const handler = async () => {
  try {
    // const responses = await Promise.all(
    //   Object.values(Categories).map(searchForCategory)
    // );
    // const flattened = responses.reduce((prev, curr) => prev.concat(curr), []);
    const flattened = await searchForCategory(null);

    const today = new Date();
    const expires = add(today, { days: 3 });

    await dynamodb.send(
      new PutItemCommand({
        TableName: DAILY_NEWSPAPER_TABLE,
        Item: {
          [DailyNewspaperTableColumn.DAY_CATEGORY_ID]: {
            S: toDayCategoryId(today, Collector.NEWS),
          },
          [DailyNewspaperTableColumn.EXPIRES]: {
            N: `${expires.getTime() / 1000}`,
          },
          [DailyNewspaperTableColumn.DATA]: {
            S: JSON.stringify(flattened),
          },
        },
      })
    );

    return flattened;
  } catch (err) {
    console.log(err);
    return err;
  }
};
