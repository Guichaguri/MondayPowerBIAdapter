import { MondayBoardProxy } from '../models/monday-board.proxy';
import { MondayClient } from './monday-client';

export async function getMondayBoardsMetadata(client: MondayClient, boardIds: number[]): Promise<MondayBoardProxy[]> {
  if (boardIds.length === 0)
    return [];

  const query = `query {
    complexity { query, after, reset_in_x_seconds }
    boards(ids: ${JSON.stringify(boardIds)}) {
      id, name,
      columns { id, title, type, settings_str }
    }
  }`;

  const result = await client.query<{ boards: MondayBoardProxy[] }>(query);

  return result.boards;
}
