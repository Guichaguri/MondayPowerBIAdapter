import { MondayClient } from './monday-client';
import { MondayItemPageProxy } from '../models/monday-item-page.proxy';
import { getMondayItemsQuery } from './getMondayItemsQuery';

export async function getMondayNextItems(
  client: MondayClient,
  cursor: string,
  limit: number,
  includeSubItems: boolean,
): Promise<MondayItemPageProxy> {
  const query =
    `query {
      complexity { query, after, reset_in_x_seconds }
      next_items_page(cursor: ${ JSON.stringify(cursor.toString()) }, limit: ${ limit }) {
        cursor,
        ${getMondayItemsQuery(includeSubItems)}
      }
    }`;

  const result = await client.query<{ next_items_page: MondayItemPageProxy }>(query);

  return result.next_items_page;
}
