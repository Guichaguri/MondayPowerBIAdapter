import { Readable } from 'stream';
import { getMondayBoard } from '../../../../monday/getMondayBoard';
import { MondayClient } from '../../../../monday/monday-client';
import { MondayBoardProxy } from '../../../../models/monday-board.proxy';
import { getMondayNextItems } from '../../../../monday/getMondayNextItems';

/**
 * Retrieves a full board chunked by page
 */
export class MondayBoardStream extends Readable {

  constructor(
    private readonly client: MondayClient,
    private readonly boardId: number,
    private readonly includeSubItems: boolean,
  ) {
    super({ objectMode: true });
  }

  /**
   * Whether there is the next page
   */
  private hasMore: boolean = true;

  /**
   * The next page cursor
   */
  private pageCursor: string | null = null;

  /**
   * Monday board data
   */
  private board?: MondayBoardProxy;

  _read(size: number) {
    if (!this.hasMore) {
      this.push(null);
      return;
    }

    this.getNextData()
      .then(result => {
        this.push(result);
      })
      .catch(err => {
        console.error(err);
        this.destroy(err);
      });
  }

  private async getNextData(): Promise<MondayBoardProxy> {
    const client = this.client;
    const includeSubItems = this.includeSubItems;
    const cursor = this.pageCursor;
    const limit = 100;

    if (!this.board || !cursor) {
      const result = await getMondayBoard(client, this.boardId, limit, includeSubItems);

      this.board = result;
      this.pageCursor = result.items_page.cursor;
      this.hasMore = !!result.items_page.cursor;

      return result;
    } else {
      const result = await getMondayNextItems(client, cursor, limit, includeSubItems);

      this.pageCursor = result.cursor;
      this.hasMore = !!result.cursor;

      return {
        ...this.board,
        items_page: result,
      };
    }
  }
}
