import { parseSkillPage, parseActivityPage, parseDisplayNamePage } from '../parse-html';
import htmlConfig from '../../util/test-util/html-mock.json';
import { PlayerSkillRow, PlayerActivityRow } from '../../types';

describe('parseSkillPage', () => {
  it('it returns PlayerSkillRow[] when given a valid normal page', () => {
    const players: PlayerSkillRow[] = parseSkillPage(htmlConfig.skillPage.normal);
    expect(players).toMatchSnapshot();
  });

  it('it parses `isDead` correctly for dead hardcore ironmen', () => {
    const players: PlayerSkillRow[] = parseSkillPage(htmlConfig.skillPage.hardcore, true);
    expect(players).toMatchSnapshot();
  });
});

describe('parseActivityPage', () => {
  it('it returns PlayerActivityRow[] when given a valid normal page', () => {
    const players: PlayerActivityRow[] = parseActivityPage(htmlConfig.activityPage.normal);
    expect(players).toMatchSnapshot();
  });

  it('it parses `isDead` correctly for dead hardcore ironmen', () => {
    const players: PlayerActivityRow[] = parseActivityPage(htmlConfig.activityPage.hardcore, true);
    expect(players).toMatchSnapshot();
  });
});

describe('parseDisplayNamePage', () => {
  it('returns display name when html contains highlighted name', () => {
    const displayName: string = parseDisplayNamePage(htmlConfig.displayNamePage.valid);
    expect(displayName).toMatchSnapshot();
  });

  it('throws Error when html does not contain highlighted name', () => {
    expect(() => parseDisplayNamePage(htmlConfig.displayNamePage.invalid)).toThrow(Error);
  });
});
