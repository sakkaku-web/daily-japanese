import { News, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { useEffect, useState } from 'react';

const client = new NewspaperClient();

export function App() {
  const [news, setNews] = useState([] as News[]);

  useEffect(() => {
    client.getNews().then(setNews);
  }, []);

  console.log(news);

  return (
    <div className="p-3">
      <h1 className="text-center">DailyJapanese</h1>
      <ul>
        {news.map((x, i) => (
          <li key={i} className="border-2 border-cyan-500 mb-3">
            <div className="mb-2">
              <a href={x.url}>
                <img src={x.urlToImage} alt={x.title} />
              </a>
            </div>
            <div className="px-4">
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
