import { DatabaseConnection } from './connectDatabase';

export interface TokenParameters {
  key: string;
  board: number;
}

export async function getTokenParameters(db: DatabaseConnection, token: string): Promise<TokenParameters | undefined> {
  const res = await db.query(
    `SELECT monday_key, monday_board FROM monday_tokens WHERE token = $1`,
    [token],
  );

  if (res.rows.length === 0)
    return undefined;

  const row = res.rows[0];

  return {
    key: row['monday_key'],
    board: row['monday_board']
  };
}
