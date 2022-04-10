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
      <h1 className="text-center text-2xl mb-3 font-bold">Daily Japanese</h1>
      <ul className="flex flex-col flex-wrap gap-4">
        {news.map((x, i) => (
          <li key={i} className="rounded-md bg-gray-800">
            <a href={x.url}>
              <img
                src={x.urlToImage}
                className="max-h-52 rounded-tl-md rounded-tr-md object-cover w-full"
                alt=""
              />
              <div className="px-4 py-2">
                <p className="mb-2 text-xs text-white/50">{x.publishedAt}</p>
                <h2 className="text-2xl font-bold">{x.title}</h2>
                <p className="font-light text-base mt-4">{x.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
