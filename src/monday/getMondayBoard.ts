import { MondayBoardProxy } from '../models/monday-board.proxy';
import { fetchMondayQuery } from './fetchMondayQuery';

export async function getMondayBoard(
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
