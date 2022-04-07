import styles from './app.module.scss';
import { NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { useEffect } from 'react';

const client = new NewspaperClient();

export function App() {
  useEffect(() => {
    client.getNews().then((x) => console.log(x));
  });

  return <div></div>;
}

export default App;
