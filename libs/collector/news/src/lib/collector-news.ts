import axios from 'axios';
import { saveCollectorData } from '@sakkaku-web/shared-cloud';

const baseURL = 'https://newsapi.org/v2';
const headlinesURL = `${baseURL}/top-headlines`;

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
    await saveCollectorData(flattened);
    return flattened;
  } catch (err) {
    console.log(err);
    return err;
  }
};
