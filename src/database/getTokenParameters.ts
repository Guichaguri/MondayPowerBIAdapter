import { DatabaseConnection } from './connectDatabase';
import { Request } from 'express';

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

export async function getParametersFromQuery(db: DatabaseConnection, req: Request): Promise<TokenParameters> {
  const { token, key, board } = req.query;

  if (token) {
    const parameters = await getTokenParameters(db, token.toString()).catch(() => undefined);

    if (parameters)
      return parameters;
  }

  if (key && board) {
    return {
      key: key.toString(),
      board: parseInt(board.toString()),
    };
  }

  throw new Error('Board ID and API credentials were not found');
}
