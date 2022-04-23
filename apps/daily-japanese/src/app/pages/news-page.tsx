import { News, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { useState, useEffect } from 'react';

interface NewsPageProps {
  client: NewspaperClient;
}

export function NewsPage({ client }: NewsPageProps) {
  const [news, setNews] = useState([] as News[]);

  useEffect(() => {
    client.getNews().then(setNews);
  }, []);

  return (
    <ul className="flex flex-col flex-wrap gap-4">
      {news.map((x, i) => (
        <li key={i} className="rounded-md bg-gray-200 dark:bg-gray-800">
          <a href={x.url}>
            <img
              src={x.urlToImage}
              className="max-h-52 rounded-tl-md rounded-tr-md object-cover w-full"
              alt=""
            />
            <div className="px-4 py-2">
              <p className="mb-2 text-xs dark:text-white/50">{x.publishedAt}</p>
              <h2 className="text-2xl font-bold">{x.title}</h2>
              <p className="font-light text-base mt-4">{x.description}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
