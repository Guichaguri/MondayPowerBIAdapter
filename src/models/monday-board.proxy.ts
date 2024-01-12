import { MondayColumnProxy } from './monday-column.proxy';
import { MondayItemPageProxy } from './monday-item-page.proxy';

export interface MondayBoardProxy {
  id: string;
  columns: MondayColumnProxy[];
  items_page: MondayItemPageProxy;
}
