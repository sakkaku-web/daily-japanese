import { NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DailyWordPage } from './pages/daily-word-page';
import { NewsPage } from './pages/news-page';

const client = new NewspaperClient();

export function App() {
  return (
    <div className="p-5 text-white md:mx-[20%] lg:mx-[35%]">
      <h1 className="text-center text-2xl mb-3 font-bold">Daily Japanese</h1>

      <Routes>
        <Route path="/daily-word" element={<DailyWordPage client={client} />} />
        <Route path="/news" element={<NewsPage client={client} />} />
        <Route path="/" element={<Navigate to="/news" />} />
      </Routes>
    </div>
  );
}

export default App;
