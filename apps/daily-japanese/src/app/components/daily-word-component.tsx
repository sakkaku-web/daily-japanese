import { DailyWord } from '@sakkaku-web/api-newspaper-client';

interface DailyWordComponentProps {
  word: DailyWord;
}

export function DailyWordComponent({ word }: DailyWordComponentProps) {
  const jishoURL = `https://jisho.org/search/${word?.word}`;

  return (
    <a
      className="flex flex-col"
      href={jishoURL}
      target="_blank"
      rel="noreferrer"
    >
      <span>{word?.reading}</span>
      <span className="text-4xl">{word?.word}</span>
    </a>
  );
}
