import { NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Nav } from './nav';
import { DailyWordPage } from './pages/daily-word-page';
import { NewsPage } from './pages/news-page';

const client = new NewspaperClient();

const links = [
  { name: 'News', link: '/news' },
  { name: 'Daily Word', link: '/daily-word' },
];

export function App() {
  return (
    <div className="page-container dark">
      <div className="p-5 md:mx-[20%] lg:mx-[35%] flex flex-col items-center">
        <h1 className="text-2xl mb-3 font-bold">Daily Japanese</h1>

        <Nav links={links} />

        <Routes>
          <Route
            path="/daily-word"
            element={<DailyWordPage client={client} />}
          />
          <Route path="/news" element={<NewsPage client={client} />} />
          <Route path="/" element={<Navigate to="/news" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
