import { Request, Response } from 'express';

export async function checkHealth(req: Request, res: Response): Promise<void> {
  res.statusCode = 200;
  res.json({
    status: 200,
  });
}
