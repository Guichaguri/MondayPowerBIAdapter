import { MondayComplexityProxy } from '../models/monday-complexity.proxy';

export interface ComplexityInfoModel {
  drained: boolean;
  restoreAt: number;
}

/**
 * Extracts the complexity information from the response
 *
 * @param data The response object
 */
export function extractComplexity(data: { complexity?: MondayComplexityProxy }): ComplexityInfoModel | undefined {
  if (!data || !data.complexity)
    return;

  const after = data.complexity.after;
  const query = data.complexity.query || 1000;

  const restoreAt = Date.now() + data.complexity.reset_in_x_seconds * 1000;
  const drained = after <= query * 5;

  return { restoreAt, drained };
}

/**
 * Awaits the complexity to be restored
 *
 * @param complexity The complexity info from the last request
 */
export async function waitToRestoreComplexity(complexity: ComplexityInfoModel | undefined): Promise<void> {
  if (!complexity || !complexity.drained)
    return;

  const ms = complexity.restoreAt - Date.now();

  if (ms <= 0)
    return;

  await new Promise(resolve => setTimeout(resolve, ms));
}
