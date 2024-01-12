
export function getMondayItemsQuery(includeSubItems: boolean): string {
  const columnValues =
    `column_values {
      id, text, value,
      ...on NumbersValue { number }
      ...on DateValue { date, time }
      ...on TimeTrackingValue { duration }
      ...on DependencyValue { display_value }
      ...on MirrorValue { display_value }
      ...on BoardRelationValue { display_value }
    }`;

  const subItemsQuery =
    `subitems {
      name, updated_at,
      ${columnValues}
    }`;

  const query =
    `items {
      name, updated_at, group { title },
      ${columnValues}
      ${includeSubItems ? subItemsQuery : ''}
    }`;

  return query;
}
