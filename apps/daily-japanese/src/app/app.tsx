import styles from './app.module.scss';
import { News, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { useEffect, useState } from 'react';

const client = new NewspaperClient();

export function App() {
  const [news, setNews] = useState([] as News[]);

  useEffect(() => {
    client.getNews().then(setNews);
  });

  return (
    <div>
      <ul>
        {news.map((x) => (
          <li>
            <a href={x.url}>{x.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
