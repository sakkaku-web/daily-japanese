import { format } from 'date-fns';

export const DAILY_NEWSPAPER_TABLE = 'DailyNewspaper';
export enum DailyNewspaperTableColumn {
  DAY_CATEGORY_ID = 'dayCategory',
  EXPIRES = 'expires',
  DATA = 'data',
}

export enum Collector {
  NEWS = 'news',
}

export function toDayCategoryId(
  date: Date,
  collector: Collector | string
): string {
  return `${format(date, 'yyyyMMdd')}#${collector}`;
}
