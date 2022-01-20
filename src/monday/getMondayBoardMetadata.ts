import { fetchMondayQuery } from './fetchMondayQuery';
import { MondayBoardProxy } from '../models/monday-board.proxy';

export async function getMondayBoardsMetadata(key: string, boardIds: number[]): Promise<MondayBoardProxy[]> {
  if (boardIds.length === 0)
    return [];

  const query = `query {
    boards(ids: ${JSON.stringify(boardIds)}) {
      id, name,
      columns { id, title, type, settings_str }
    }
  }`;

  const result = await fetchMondayQuery<{ boards: MondayBoardProxy[] }>(key, query);

  return result.boards;
}
