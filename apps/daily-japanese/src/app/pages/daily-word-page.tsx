import { DailyWord, NewspaperClient } from '@sakkaku-web/api-newspaper-client';
import { JapaneseWordle } from '@sakkaku-web/components/japanese-wordle';
import { add } from 'date-fns';
import { useEffect, useState } from 'react';

interface DailyWordPageProps {
  client: NewspaperClient;
}

export function DailyWordPage({ client }: DailyWordPageProps) {
  const [nextDailyWords, setNextDailyWords] = useState([] as DailyWord[]);

  useEffect(() => {
    const today = new Date();
    client.getDailyWords(add(today, { days: 1 })).then(setNextDailyWords);
  }, []);

  const getWordForWordle = () => {
    return nextDailyWords[0]?.reading;
  };

  const getAttemptsForWord = (word: string) => {
    return word.length * 2;
  };

  const wordleWord = getWordForWordle();
  return (
    <div>
      {wordleWord && (
        <JapaneseWordle
          word={wordleWord}
          maxAttempts={getAttemptsForWord(wordleWord)}
          darkMode={true}
        />
      )}
    </div>
  );
}
