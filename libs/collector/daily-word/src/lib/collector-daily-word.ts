import { Collector, saveCollectorData } from '@sakkaku-web/shared-cloud';
import axios from 'axios';
import { EventBridgeEvent } from 'aws-lambda';
import { add, parseISO } from 'date-fns';

const baseURL = 'https://jisho.org/api/v1';
const searchURL = `${baseURL}/search/words`;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * max) + min;
}

function parseWord(data: Record<string, any>) {
  return {
    word: data.slug,
    reading: data.japanese[0].reading,
  };
}

async function searchRandomWord(keyword: string, page: number) {
  const query = new URLSearchParams({
    keyword: `#${keyword}`,
    page: `${page}`,
  });

  const { data } = await axios.get(`${searchURL}?${query.toString()}`);

  if (data.data.length === 0) {
    if (page > 1) {
      return searchRandomWord(keyword, page - 1);
    }

    return null;
  }

  const idx = randomInt(0, data.data.length);
  return {
    ...parseWord(data.data[idx]),
    category: keyword,
  };
}

const CATEGORIES_MAX_PAGES = {
  // common: 1000,
  'jlpt-n5': 33,
  'jlpt-n4': 29,
  'jlpt-n3': 89,
  'jlpt-n2': 91,
  'jlpt-n1': 172,
};

export const handler = async (
  event: EventBridgeEvent<string, string>,
  context: any
) => {
  const date = event.time ? parseISO(event.time) : new Date();
  const nextDay = add(date, { days: 1 });

  try {
    const requests = Object.keys(CATEGORIES_MAX_PAGES).map(async (cat) => {
      return searchRandomWord(cat, randomInt(1, CATEGORIES_MAX_PAGES[cat] + 1));
    });

    const words = await Promise.all(requests);
    const nonNull = words.filter((x) => !!x);

    await saveCollectorData(Collector.DAILY_WORD, nonNull, nextDay);

    return words;
  } catch (err) {
    console.log(err);
    return err;
  }
};
