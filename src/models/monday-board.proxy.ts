import { MondayColumnProxy } from './monday-column.proxy';
import { MondayColumnValueProxy } from './monday-column-value.proxy';
import { MondayItemProxy } from './monday-item.proxy';

export interface MondayBoardProxy {
  id: string;
  columns: MondayColumnProxy[];
  items: MondayItemProxy[];
}
