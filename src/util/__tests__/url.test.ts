import { buildStatsUrl, buildSkillPageUrl, buildActivityPageUrl, buildSkillPageWithDisplayNameUrl } from '../url';

describe('buildStatsUrl', () => {
  it('returns expected url without mode specified', () => {
    const url = buildStatsUrl('zezima');
    expect(url).toMatchSnapshot();
  });

  it('returns expected url when mode is specified', () => {
    const url = buildStatsUrl('zezima', 'hardcore');
    expect(url).toMatchSnapshot();
  });
});

describe('buildSkillPageUrl', () => {
  it('returns expected url with default mode', () => {
    const url = buildSkillPageUrl('woodcutting');
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with undefined mode', () => {
    const url = buildSkillPageUrl('woodcutting', undefined);
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with specified mode', () => {
    const url = buildSkillPageUrl('hitpoints', 'hardcore');
    expect(url).toMatchSnapshot();
  });
});

describe('buildActivityPageUrl', () => {
  it('returns expected url with default mode', () => {
    const url = buildActivityPageUrl('cerberus');
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with default mode', () => {
    const url = buildActivityPageUrl('cerberus', undefined);
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with specified mode', () => {
    const url = buildActivityPageUrl('easy', 'hardcore');
    expect(url).toMatchSnapshot();
  });
});

describe('buildDisplayNameUrl', () => {
  it('returns expected url with default skill and mode', () => {
    const url = buildSkillPageWithDisplayNameUrl('zezima');
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with default mode', () => {
    const url = buildSkillPageWithDisplayNameUrl('zezima', 'construction');
    expect(url).toMatchSnapshot();
  });

  it('returns expected url with default skill', () => {
    const url = buildSkillPageWithDisplayNameUrl('zezima', undefined, 'ironman');
    expect(url).toMatchSnapshot();
  });
});
