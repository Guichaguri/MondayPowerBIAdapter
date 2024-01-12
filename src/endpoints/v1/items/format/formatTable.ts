import { ColumnFormatter } from './columnFormatter';
import { BoardColumn } from '../columns/getTableHeaders';
import { MondayColumnValueProxy } from '../../../../models/monday-column-value.proxy';

export function formatHeader(columns: BoardColumn[], columnFormatter: ColumnFormatter): string[] {
  const header: string[] = [];

  columns.forEach(({ title, type }) => {
    header.push(title);

    const formatter = columnFormatter[type];

    if (formatter?.additionalColumnSuffixes) {
      formatter.additionalColumnSuffixes.forEach(s => header.push(title + ' ' + s));
    }
  });

  return header;
}

export function formatItems(items: MondayColumnValueProxy[][], columns: BoardColumn[], columnFormatter: ColumnFormatter): string[][] {
  return items.map(values => {
    const data: (string | undefined)[] = [];

    columns.forEach((column, i) => {
      const columnValue = values[i];

      const formatter = columnFormatter[column.type];
      let columnData: string | undefined = columnValue?.display_value || columnValue?.text;

      if (formatter?.format && columnValue)
        columnData = formatter.format(columnValue);

      data.push(columnData);

      if (formatter?.addAdditionalColumns)
        data.push(...formatter.addAdditionalColumns(columnValue));
    });

    return data.map(c => c ?? '');
  });
}
