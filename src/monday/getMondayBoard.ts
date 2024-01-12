import { MondayBoardProxy } from '../models/monday-board.proxy';
import { MondayClient } from './monday-client';
import { getMondayItemsQuery } from './getMondayItemsQuery';

export async function getMondayBoard(
  client: MondayClient,
  boardId: number,
  limit: number,
  includeSubItems: boolean,
): Promise<MondayBoardProxy> {
  const query =
    `query {
      complexity { query, after, reset_in_x_seconds }
      boards(ids: [${boardId}]) {
        id, name, columns { id, title, type, settings_str },
        items_page(limit: ${limit}) {
          cursor,
          ${getMondayItemsQuery(includeSubItems)}
        }
      }
    }`;

  const result = await client.query<{ boards: MondayBoardProxy[] }>(query);

  return result.boards[0];
}
