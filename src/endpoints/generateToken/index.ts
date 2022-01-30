import { DatabaseConnection } from '../../database/connectDatabase';
import { Request, Response } from 'express';
import { isBoardValid } from '../../monday/isBoardValid';
import { generateToken } from '../../database/generateToken';

export async function generateTokenEndpoint(db: DatabaseConnection, req: Request, res: Response): Promise<void> {
  const { key, board } = req.body as { key: string, board: string };

  if (!key || !board)
    return void res.status(400).end('Missing API Key and Board ID properties');

  const boardId = parseInt(board);

  if (isNaN(boardId) || !(await isBoardValid(key, boardId)))
    return void res.status(400).end('Invalid board or API key');

  const token = await generateToken(db, key, boardId).catch(() => undefined);

  if (!token)
    return void res.status(500).end('Could not generate the token at this moment');

  res.end(token);
}
