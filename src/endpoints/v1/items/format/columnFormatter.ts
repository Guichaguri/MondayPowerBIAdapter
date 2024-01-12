import { MondayColumnValueProxy } from '../../../../models/monday-column-value.proxy';

export interface FormatterType {
  additionalColumnSuffixes?: string[],
  addAdditionalColumns?: (value: MondayColumnValueProxy) => (string | undefined)[];
  format?: (value: MondayColumnValueProxy) => string;
}

export type ColumnFormatter = Record<string, FormatterType>;

function formatByLocale(columnValue: MondayColumnValueProxy, locale: string): string {
  const str = columnValue?.display_value || columnValue?.text || '';
  const num = columnValue?.number ?? parseFloat(str);

  if (isNaN(num))
    return str;

  return num.toLocaleString([locale, 'en-US'], {
    notation: 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

const baseFormatter: ColumnFormatter = {

  'date': {
    additionalColumnSuffixes: ['(date)', '(time)'],
    addAdditionalColumns: (columnValue) => [columnValue?.date, columnValue?.time],
  },

  'time_tracking': {
    additionalColumnSuffixes: ['(seconds)'],
    addAdditionalColumns: (columnValue) => [columnValue?.duration?.toString()],
  },

  'numbers': {
    format: (columnValue) => formatByLocale(columnValue, 'en-US'),
  }

}

export function createFormatter(dismember: boolean, locale: string): ColumnFormatter {
  const numberFormatter: ColumnFormatter = {
    'numbers': {
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
