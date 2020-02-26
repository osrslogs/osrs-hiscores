import { RankedStats } from '../types';

/**
 * Finds the name of the first ranked stat in rankedStats
 *
 * @param {RankedStats} rankedStats
 *
 * @returns {string | undefined} The name of the ranked stat, else undefined
 */
// eslint-disable-next-line import/prefer-default-export
export const getRankedStat = (rankedStats: RankedStats): string | undefined => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(rankedStats)) {
    if (value.rank > 0) {
      return key;
    }
  }
  return undefined;
};
