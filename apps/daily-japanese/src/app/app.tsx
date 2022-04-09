import { News, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { useEffect, useState } from 'react';

const client = new NewspaperClient();

export function App() {
  const [news, setNews] = useState([] as News[]);

  useEffect(() => {
    client.getNews().then(setNews);
  }, []);

  return (
    <div className="p-5 text-white md:mx-[20%] lg:mx-[35%]">
      <h1 className="text-center text-2xl mb-3 font-bold">DailyJapanese</h1>
      <ul className="flex flex-col flex-wrap gap-4">
        {news.map((x, i) => (
          <li key={i} className="rounded-md bg-gray-800">
            <div className="mb-2">
              <a href={x.url}>
                <img
                  src={x.urlToImage}
                  alt=""
                  className="rounded-tl-md rounded-tr-md"
                />
              </a>
              <small className="px-4">{x.publishedAt}</small>
            </div>
            <div className="px-4 pb-2">
              <h2 className="text-2xl font-bold">
                <a href={x.url}>{x.title}</a>
                <p className="font-light text-base mt-4">{x.description}</p>
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
