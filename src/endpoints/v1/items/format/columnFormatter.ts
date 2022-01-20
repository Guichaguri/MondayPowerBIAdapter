import { MondayColumnValueProxy } from '../../../../models/monday-column-value.proxy';

export interface FormatterType {
  additionalColumnSuffixes?: string[],
  addAdditionalColumns?: (value: MondayColumnValueProxy) => (string | undefined)[];
  format?: (value: MondayColumnValueProxy) => string;
}

export type ColumnFormatter = Record<string, FormatterType>;

function parseColumnValue<T>(columnValue: MondayColumnValueProxy): Partial<T> {
  try {
    return JSON.parse(columnValue.value ?? '{}');
  } catch(err) {
    return {};
  }
}

export const columnFormatter: ColumnFormatter = {

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

  'number': {
    format: (columnValue) => {
      const num = parseFloat(columnValue.text);

      if (isNaN(num))
        return columnValue.text;

      return num.toFixed(6);
    }
  }

}
