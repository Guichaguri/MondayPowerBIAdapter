import { ComplexityInfoModel, extractComplexity, waitToRestoreComplexity } from '../utils/complexity';
import { fetchMondayQuery } from './fetchMondayQuery';

export class MondayClient {

  constructor(private readonly key: string) {
  }

  private lastComplexity: ComplexityInfoModel | undefined;

  public async query<T>(query: string): Promise<T> {
    await waitToRestoreComplexity(this.lastComplexity);

    const result = await fetchMondayQuery<T>(this.key, query);

    this.lastComplexity = extractComplexity(result);

    return result;
  }

}
