import { MondayBoardProxy } from '../models/monday-board.proxy';
import { fetchMondayQuery } from './fetchMondayQuery';

async function fetchMondayItems(
  key: string, boardId: number, page: number, limit: number,
  includeBoardMetadata: boolean, includeSubItems: boolean,
): Promise<MondayBoardProxy> {
  const boardMetadataQuery =
    `id, name, columns { id, title, type, settings_str },`;

  const subItemsQuery =
    `subitems {
      name, updated_at,
      column_values { id, text, value }
    }`;

  const query =
    `query {
      boards(ids: [${boardId}]) {
        ${includeBoardMetadata ? boardMetadataQuery : ''}
        items(limit: ${limit}, page: ${page}) {
          name,  updated_at, group { title },
          column_values { id, text, value }
          ${includeSubItems ? subItemsQuery : ''}
        }
      }
    }`;

  const result = await fetchMondayQuery<{ boards: MondayBoardProxy[] }>(key, query);

  return result.boards[0];
}

export async function getMondayBoard(key: string, boardId: number, includeSubItems: boolean): Promise<MondayBoardProxy> {
  let hasMore = true;
  let page = 1;
  let board = {} as MondayBoardProxy;

  while (hasMore) {
    const firstPage = page === 1;
    const result = await fetchMondayItems(key, boardId, page, 100, firstPage, includeSubItems);

    if (firstPage) {
      board = result;
    } else {
      board.items = [...board.items, ...result.items];
    }

    hasMore = result.items.length >= 100;
    page++;
  }

  return board;
}
