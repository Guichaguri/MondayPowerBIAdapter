import { Transform, TransformCallback } from 'stream';
import { MondayBoardProxy } from '../../../../models/monday-board.proxy';
import { formatHeader, formatItems } from '../format/formatTable';
import { ColumnFormatter } from '../format/columnFormatter';
import { BoardColumn, getTableHeaders } from '../columns/getTableHeaders';
import { convertItemsToTable } from '../columns/convertItemsToTable';
import { MondayClient } from '../../../../monday/monday-client';

/**
 * Transforms monday boards into a table formatted as string arrays
 */
export class TransformItemsStream extends Transform {

  constructor(
    private readonly client: MondayClient,
    private readonly includeSubItems: boolean,
    private readonly columnFormatter: ColumnFormatter,
  ) {
    super({ objectMode: true });
  }

  /**
   * Whether the headers have already been added
   */
  private headersAdded: boolean = false;

  /**
   * The board columns
   */
  private headers: BoardColumn[] = [];

  /**
   * Transforms board proxies into array of strings
   *
   * @param chunk The board proxy
   */
  private async transformBoardItems(chunk: MondayBoardProxy): Promise<void> {
    if (!this.headersAdded) {
      this.headers = await getTableHeaders(this.client, chunk, this.includeSubItems);
      this.push(formatHeader(this.headers, this.columnFormatter));
      this.headersAdded = true;
    }

    const table = convertItemsToTable(chunk, this.headers);
    const lines = formatItems(table, this.headers, this.columnFormatter);

    lines.forEach(line => this.push(line));
  }

  _transform(chunk: MondayBoardProxy, encoding: BufferEncoding, callback: TransformCallback) {
    this.transformBoardItems(chunk)
      .then(() => callback())
      .catch(err => {
        console.error(err);
        callback(err);
      });
  }
}
