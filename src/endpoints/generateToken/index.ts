import { DatabaseConnection } from '../../database/connectDatabase';
import { Request, Response } from 'express';
import { isBoardValid } from '../../monday/isBoardValid';
import { generateToken } from '../../database/generateToken';

export async function generateTokenEndpoint(db: DatabaseConnection, req: Request, res: Response): Promise<void> {
  const { key, board } = req.body as { key: string, board: string };

  if (!key || !board)
    throw new Error('Missing API Key and Board ID properties');

  const boardId = parseInt(board);

  if (isNaN(boardId) || !await isBoardValid(key, boardId))
    throw new Error('Invalid board');

  const token = await generateToken(db, key, boardId);
  res.end(token);
}
