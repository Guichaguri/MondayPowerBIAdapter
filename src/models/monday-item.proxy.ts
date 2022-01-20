import { MondayColumnValueProxy } from './monday-column-value.proxy';

export interface MondayItemProxy {
  name: string;
  updated_at: string;
  group: {
    title: string;
  };
  column_values: MondayColumnValueProxy[];
  subitems: MondayItemProxy[];
}
