import { getMondayBoardsMetadata } from '../../../../monday/getMondayBoardMetadata';
import { MondayBoardProxy } from '../../../../models/monday-board.proxy';
import { MondayColumnProxy } from '../../../../models/monday-column.proxy';
import { MondayClient } from '../../../../monday/monday-client';

export interface BoardColumn {
  isMainBoard: boolean;
  boardId: string;
  columnId: string;
  type: string;
  title: string;
}

export enum PredefinedColumnType {
  TITLE = '__title',
  UPDATED_AT = '__updated_at',
  GROUP = '__group',
}

const ignoredTypes = ['name', 'subtasks', 'formula', 'columns-battery'];

const predefinedColumns = [
  {id: PredefinedColumnType.TITLE, title: 'Title'},
  {id: PredefinedColumnType.UPDATED_AT, title: 'Updated At'},
  {id: PredefinedColumnType.GROUP, title: 'Group', mainOnly: true},
];

export async function getTableHeaders(client: MondayClient, board: MondayBoardProxy, includeSubitems: boolean): Promise<BoardColumn[]> {
  const columnIds: BoardColumn[] = [
    ...getColumns(board, true),
  ];

  if (!includeSubitems)
    return columnIds;

  const subitemBoardIds = getSubitemBoardIds(board.columns);
  const subitemBoards = await getMondayBoardsMetadata(client, subitemBoardIds);

  for (const subitemBoard of subitemBoards) {
    columnIds.push(...getColumns(subitemBoard, false));
  }

  return columnIds;
}

function getColumns(board: MondayBoardProxy, isMainBoard: boolean): BoardColumn[] {
  const basicColumns = predefinedColumns
    .filter(c => isMainBoard || !c.mainOnly)
    .map(c => {
      return {
        isMainBoard,
        boardId: board.id,
        columnId: c.id,
        type: c.id,
        title: (isMainBoard ? '' : 'Subitem ') + c.title,
      }
    });

  const boardColumns = board.columns
    .filter(column => !ignoredTypes.includes(column.type))
    .map(column => {
      return {
        isMainBoard,
        boardId: board.id,
        columnId: column.id,
        type: column.type,
        title: column.title,
      };
    });

  return [...basicColumns, ...boardColumns];
}

function getSubitemBoardIds(columns: MondayColumnProxy[]): number[] {
  const subitemBoards: number[] = [];

  for (const column of columns) {
    if (column.type !== 'subtasks')
      continue;

    try {
      const settings = JSON.parse(column.settings_str);

      subitemBoards.push(...settings.boardIds);
    } catch (err) {
      // NOOP
    }
  }

  return subitemBoards;
}

