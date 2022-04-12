import { DailyWord, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { JapaneseWordle } from '@sakkaku-web/components/japanese-wordle';
import { add, isSameDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { DailyWordCategorySelect } from '../components/daily-word-category-select';
import { DailyWordComponent } from '../components/daily-word-component';

interface DailyWordPageProps {
  client: NewspaperClient;
}

const DAILY_WORD_CATEGORY_KEY = 'dailyJapanese-dailyWord-category';
const DAILY_WORD_CACHE = 'dailyJapanese-dailyWord-cache';

interface DailyWordCache {
  dailyWords: DailyWord[];
  nextDailyWords: DailyWord[];
  date: string;
}

export function DailyWordPage({ client }: DailyWordPageProps) {
  const [dailyWords, setDailyWords] = useState([] as DailyWord[]);
  const [nextDailyWords, setNextDailyWords] = useState([] as DailyWord[]);
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem(DAILY_WORD_CATEGORY_KEY)
  );

  const saveSelectedCategory = (cat: string) => {
    setSelectedCategory(cat);
    localStorage.setItem(DAILY_WORD_CATEGORY_KEY, cat);
  };

  const updateDailyWordCache = (data: Partial<DailyWordCache>) => {
    localStorage.setItem(
      DAILY_WORD_CACHE,
      JSON.stringify({
        dailyWords,
        nextDailyWords,
        ...data,
        date: new Date().toISOString(),
      })
    );
  };

  useEffect(() => {
    const today = new Date();
    const cache = JSON.parse(
      localStorage.getItem(DAILY_WORD_CACHE) || '{}'
    ) as DailyWordCache;

    if (
      isSameDay(today, new Date(cache.date)) &&
      cache.dailyWords.length &&
      cache.nextDailyWords.length
    ) {
      setDailyWords(cache.dailyWords);
      setNextDailyWords(cache.nextDailyWords);
      return;
    }

    client.getDailyWords(today).then((words) => {
      setDailyWords(words);
      updateDailyWordCache({ dailyWords: words });
    });
    client.getDailyWords(add(today, { days: 1 })).then((words) => {
      setNextDailyWords(words);
      updateDailyWordCache({ nextDailyWords: words });
    });
  }, []);

  useEffect(() => {
    if (selectedCategory == null) {
      setSelectedCategory(dailyWords[0]?.category);
    }
  }, [dailyWords, selectedCategory]);

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
            onCategorySelect={saveSelectedCategory}
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
