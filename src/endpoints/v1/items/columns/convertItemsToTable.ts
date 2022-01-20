import { MondayItemProxy } from '../../../../models/monday-item.proxy';
import { MondayColumnValueProxy } from '../../../../models/monday-column-value.proxy';
import { MondayBoardProxy } from '../../../../models/monday-board.proxy';
import { BoardColumn, PredefinedColumnType } from './getTableHeaders';
import { formatDateTime } from '../../../../utils/formatDateTime';

export function convertItemsToTable(board: MondayBoardProxy, columns: BoardColumn[]): MondayColumnValueProxy[][] {
  const values: MondayColumnValueProxy[][] = [];

  const boardId = board.id;

  board.items.forEach(item => addItemsToTable(values, boardId, columns, item));

  return values;
}

function addItemsToTable(values: MondayColumnValueProxy[][], boardId: string, columns: BoardColumn[], item: MondayItemProxy): void {
  const data: MondayColumnValueProxy[] = [];

  setColumnValue(data, columns, { id: PredefinedColumnType.GROUP, text: item.group.title }, true);
  setColumnValues(data, columns, item, true);

  if (!item.subitems || item.subitems.length === 0) {
    values.push(data);
  } else {
    item.subitems.forEach(item => {
      const subData: MondayColumnValueProxy[] = [...data];

      setColumnValues(subData, columns, item, false);

      values.push(subData);
    });
  }
}

function setColumnValues(data: MondayColumnValueProxy[], columns: BoardColumn[], item: MondayItemProxy, isMainBoard: boolean) {
  setColumnValue(data, columns, { id: PredefinedColumnType.TITLE, text: item.name }, isMainBoard);
  setColumnValue(data, columns, { id: PredefinedColumnType.UPDATED_AT, text: formatDateTime(item.updated_at) }, isMainBoard);

  item.column_values.forEach(columnValue => setColumnValue(data, columns, columnValue, isMainBoard));
}

function setColumnValue(data: MondayColumnValueProxy[], columns: BoardColumn[], value: MondayColumnValueProxy, isMainBoard: boolean) {
  const index = columns.findIndex(c => c.isMainBoard === isMainBoard && c.columnId === value.id);

  if (index !== -1)
    data[index] = value;
}
