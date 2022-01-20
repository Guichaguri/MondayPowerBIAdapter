import { Request, Response } from 'express';
import { writeCsv } from '../../../utils/writeCsv';
import { getTokenParameters, TokenParameters } from '../../../database/getTokenParameters';
import { getMondayBoard } from '../../../monday/getMondayBoard';
import { DatabaseConnection } from '../../../database/connectDatabase';
import { getTableHeaders } from './columns/getTableHeaders';
import { convertItemsToTable } from './columns/convertItemsToTable';
import { formatTable } from './format/formatTable';

export async function getItemsV1Endpoint(db: DatabaseConnection, req: Request, res: Response): Promise<void> {
  const table = await getMondayTable(db, req)
    .catch((err) => [['Error'], [err.message], [err.stack]]);

  writeCsv(table, res);
}

async function getMondayTable(db: DatabaseConnection, req: Request): Promise<string[][]> {
  const includeSubitems = req.query.subitems !== undefined;
  const shouldDismember = req.query.dismember !== undefined;

  const parameters = await getParametersFromQuery(db, req);

  const board = await getMondayBoard(parameters.key, parameters.board, includeSubitems);
  const header = await getTableHeaders(parameters.key, board, includeSubitems);

  const tableItems = convertItemsToTable(board, header);

  return formatTable(tableItems, header, shouldDismember);
}

async function getParametersFromQuery(db: DatabaseConnection, req: Request): Promise<TokenParameters> {
  const { token, key, board } = req.query;

  if (token) {
    const parameters = await getTokenParameters(db, token.toString());

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
