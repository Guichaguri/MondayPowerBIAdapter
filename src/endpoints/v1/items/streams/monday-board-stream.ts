import { Readable } from 'stream';
import { getMondayBoard } from '../../../../monday/getMondayBoard';

/**
 * Retrieves a full board chunked by page
 */
export class MondayBoardStream extends Readable {

  constructor(
    private readonly key: string,
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
   * The page number
   */
  private page: number = 1;

  _read(size: number) {
    if (!this.hasMore) {
      this.push(null);
      return;
    }

    const page = this.page;
    const firstPage = this.page === 1;

    getMondayBoard(this.key, this.boardId, page, 100, firstPage, this.includeSubItems)
      .then(result => {
        this.page++;
        this.hasMore = result.items.length >= 100;
        this.push(result);
      })
      .catch(err => this.destroy(err));
  }
}
