import { EventBridgeEvent } from 'aws-lambda';
import axios from 'axios';

const baseURL = 'https://newsapi.org/v2';
const headlinesURL = `${baseURL}/top-headlines`;

export const handler = async (event: EventBridgeEvent<string, void>) => {
  const query = new URLSearchParams({
    country: 'jp',
    apiKey: process.env.NEWS_API,
    pageSize: '5',
  });

  try {
    const { data } = await axios.get(`${headlinesURL}?${query.toString()}`);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
