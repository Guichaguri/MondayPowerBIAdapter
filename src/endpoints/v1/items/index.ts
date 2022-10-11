import { Request, Response } from 'express';
import iconv from 'iconv-lite';
import csv from 'csv-stringify';
import { pipeline } from 'stream';
import { promisify } from 'util';

import { getParametersFromQuery } from '../../../database/getTokenParameters';
import { DatabaseConnection } from '../../../database/connectDatabase';
import { createFormatter } from './format/columnFormatter';
import { MondayBoardStream } from './streams/monday-board-stream';
import { TransformItemsStream } from './streams/transform-items-stream';
import { StringifyStream } from './streams/stringify-stream';
import { MondayClient } from '../../../monday/monday-client';

const pipelinePromise = promisify(pipeline);

export function getItemsV1Endpoint(db: DatabaseConnection, req: Request, res: Response): void {
  createItemsStream(db, req, res).catch(err => {
    res.write('Error\n');
    res.end(err.toString());
  })
}

async function createItemsStream(db: DatabaseConnection, req: Request, res: Response): Promise<void> {
  res.setHeader('Content-Type', 'text/csv; charset=windows-1252');
  res.flushHeaders();

  const includeSubitems = req.query.subitems !== undefined;
  const shouldDismember = req.query.dismember !== undefined;
  const locale = req.query.locale?.toString() || 'en-US';

  const formatter = createFormatter(shouldDismember, locale);
  const parameters = await getParametersFromQuery(db, req);

  const client = new MondayClient(parameters.key);

  const boardStream = new MondayBoardStream(client, parameters.board, includeSubitems);
  const formatStream = new TransformItemsStream(client, includeSubitems, formatter);

  const csvStream = csv({ delimiter: ',' });
  const stringifyStream = new StringifyStream();
  const iconvStream = iconv.encodeStream('win-1252');

  boardStream.once('error', err => {
    res.write('Error\n');
    res.end(err.toString());
  });

  await pipelinePromise(boardStream, formatStream, csvStream, stringifyStream, iconvStream, res);
}

