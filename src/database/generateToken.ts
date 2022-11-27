import { DatabaseConnection } from './connectDatabase';
import { QueryResult } from 'pg';

const tokenChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function createRandomToken() {
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += tokenChars[Math.floor(Math.random() * tokenChars.length)];
  }
  return token;
}

async function findToken(db: DatabaseConnection, key: string, board: number): Promise<string | undefined> {
  if (!db)
    return undefined;

  const res = await db.query<{ token: string }>(
    `SELECT token FROM monday_tokens WHERE monday_key = $1 AND monday_board = $2`,
    [key, board],
  );

  if (res.rows.length > 0) {
    return res.rows[0].token;
  }

  return undefined;
}

async function createToken(db: DatabaseConnection, key: string, board: number): Promise<string> {
  if (!db)
    throw new Error('The database must be available in order to generate tokens');

  let token: string;
  let res: QueryResult;

  do {
    token = createRandomToken();

    res = await db.query(
      `SELECT token FROM monday_tokens WHERE token = $1`,
      [token],
    );
  } while (res.rows.length > 0);

  await db.query(
    `INSERT INTO monday_tokens (token, monday_key, monday_board) VALUES ($1, $2, $3)`,
    [token, key, board],
  );

  return token;
}

export async function generateToken(db: DatabaseConnection, key: string, board: number): Promise<string> {
  // Looks for an existing token
  const token = await findToken(db, key, board);

  if (token) {
    return token;
  }

  // In case the board has no token yet, we'll generate a new one
  return await createToken(db, key, board);
}

