import { MondayColumnValueProxy } from '../../../../models/monday-column-value.proxy';

export interface FormatterType {
  additionalColumnSuffixes?: string[],
  addAdditionalColumns?: (value: MondayColumnValueProxy) => (string | undefined)[];
  format?: (value: MondayColumnValueProxy) => string;
}

export type ColumnFormatter = Record<string, FormatterType>;

function parseColumnValue<T>(columnValue: MondayColumnValueProxy): Partial<T> {
  try {
    return JSON.parse(columnValue?.value ?? '{}');
  } catch(err) {
    return {};
  }
}

function formatByLocale(columnValue: MondayColumnValueProxy, locale: string): string {
  const num = parseFloat(columnValue.text);

  if (isNaN(num))
    return columnValue.text;

  return num.toLocaleString([locale, 'en-US'], {
    notation: 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

const baseFormatter: ColumnFormatter = {

  'date': {
    additionalColumnSuffixes: ['(date)', '(time)'],
    addAdditionalColumns: (columnValue) => {
      const value = parseColumnValue<{ date: string, time: string }>(columnValue);

      return [value.date, value.time];
    }
  },

  'duration': {
    additionalColumnSuffixes: ['(seconds)'],
    addAdditionalColumns: (columnValue) => {
      const value = parseColumnValue<{ duration: string }>(columnValue);

      return [value.duration];
    }
  },

  'numeric': {
    format: (columnValue) => formatByLocale(columnValue, 'en-US'),
  }

}

export function createFormatter(dismember: boolean, locale: string): ColumnFormatter {
  const numberFormatter: ColumnFormatter = {
    'numeric': {
      format: (columnValue) => formatByLocale(columnValue, locale),
    },
  };

  if (!dismember)
    return numberFormatter;

  return {
    ...baseFormatter,
    ...numberFormatter,
  };
}
