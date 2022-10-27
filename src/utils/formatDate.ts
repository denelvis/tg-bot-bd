import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export enum DateFormats {
  SERVER = 'YYYY-MM-DD',
  USER = 'DD.MM.YYYY',
}

export enum Locale {
  DEFAULT = 'ru',
}

export function formatDate(
  date?: string | Dayjs,
  formatInput = DateFormats.USER,
  formatOutput = DateFormats.SERVER,
  locale = Locale.DEFAULT
): string {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    return dayjs(date, formatInput).locale(locale).format(formatOutput);
  }

  return date.locale(locale).format(formatOutput);
}
