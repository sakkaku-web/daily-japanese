import { DailyWord, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { JapaneseWordle } from '@sakkaku-web/components/japanese-wordle';
import { add } from 'date-fns';
import { useEffect, useState } from 'react';
import { DailyWordCategorySelect } from '../components/daily-word-category-select';
import { DailyWordComponent } from '../components/daily-word-component';

interface DailyWordPageProps {
  client: NewspaperClient;
}

export function DailyWordPage({ client }: DailyWordPageProps) {
  const [dailyWords, setDailyWords] = useState([] as DailyWord[]);
  const [nextDailyWords, setNextDailyWords] = useState([] as DailyWord[]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const today = new Date();
    client.getDailyWords(today).then((words) => {
      setDailyWords(words);
      setSelectedCategory(words[0]?.category);
    });
    client.getDailyWords(add(today, { days: 1 })).then(setNextDailyWords);
  }, []);

  const getAttemptsForWord = (word: string) => {
    return word.length * 2;
  };

  const wordleWord = nextDailyWords.find(
    (w) => w.category === selectedCategory
  )?.reading;
  const word = dailyWords.find((w) => w.category === selectedCategory);
  const categories = dailyWords.map((w) => w.category);

  return (
    <div className="flex flex-col gap-8 text-center">
      <div className="flex flex-col text-center items-center">
        {word && <DailyWordComponent word={word} />}

        {word && (
          <DailyWordCategorySelect
            categories={categories}
            category={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
      </div>
      {wordleWord && (
        <div>
          <h2 className="font-bold text-2xl my-4">Next Word</h2>
          <JapaneseWordle
            word={wordleWord}
            maxAttempts={getAttemptsForWord(wordleWord)}
            darkMode={true}
          />
        </div>
      )}
    </div>
  );
}
