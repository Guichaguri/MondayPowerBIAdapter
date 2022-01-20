import { fetchMondayQuery } from './fetchMondayQuery';

export async function isBoardValid(key: string, board: number): Promise<boolean> {
  const query = 'query { boards(ids: [' + board + ']) { name } }';

  const data = await fetchMondayQuery<{ boards: unknown[] } | undefined>(key, query)
    .catch(() => undefined);

  return !!data?.boards && data.boards.length > 0;
}
