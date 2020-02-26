import { getRankedStat } from '../stats';
import statsConfig from '../test-util/stats-mock.json';

describe('getRankedSkill', () => {
  it('returns a skill name when there is a ranked skill', () => {
    const result = getRankedStat(statsConfig.rankedSkill);
    expect(result).toMatchSnapshot();
  });

  it('returns undefined when there are no ranked skills', () => {
    const result = getRankedStat(statsConfig.noRankedSkill);
    expect(result).toBe(undefined);
  });
});
