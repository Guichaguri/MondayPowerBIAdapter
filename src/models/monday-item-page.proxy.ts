import { MondayItemProxy } from './monday-item.proxy';

export interface MondayItemPageProxy {
  cursor: string | null;
  items: MondayItemProxy[];
}
