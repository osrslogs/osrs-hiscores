/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import Hiscores from '../hiscores';
import { Stats, PlayerSkillRow, Mode, PlayerActivityRow, DisplayName, PlayerMode } from '../types';
import { buildStatsUrl, buildSkillPageUrl, buildActivityPageUrl } from '../util/url';
import {
  HttpError,
  InvalidCsvError,
  InvalidPlayerError,
  InvalidHtmlError,
  ServiceUnavailableError,
} from '../util/error';
import csvConfig from '../util/test-util/csv-mock.json';
import statsConfig from '../util/test-util/stats-mock.json';
import htmlConfig from '../util/test-util/html-mock.json';

jest.mock('axios');
const mockAxios = mocked(axios, true);
const player = 'zezima';

describe('constructor', () => {
  it('creates an object with UA config', () => {
    const expected = {
      userAgent: 'hello world',
    };

    const result: Hiscores = new Hiscores(expected);

    expect(result.config).toEqual(expected);
  });

  it('creates an object with timeout config', () => {
    const expected = {
      timeout: 123,
    };

    const result: Hiscores = new Hiscores(expected);

    expect(result.config.timeout).toEqual(expected.timeout);
  });

  it('creates an object with proxy config', () => {
    const expected = {
      proxy: {
        host: '123.123.123.123',
        port: 1234,
      },
    };

    const result: Hiscores = new Hiscores(expected);

    expect(result.config.proxy).toEqual(expected.proxy);
  });
});

describe('getStats', () => {
  const hiscores: Hiscores = new Hiscores();

  it('throws InvalidPlayerError if player name is invalid', async () => {
    const invalidPlayerName = '&#¤%#';

    await expect(hiscores.getStats(invalidPlayerName)).rejects.toThrow(InvalidPlayerError);
  });

  it('throws HttpError if request fails unexpectedly', async () => {
    mockAxios.get.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    const result: Promise<Stats> = hiscores.getStats(player);

    await expect(result).rejects.toThrow(HttpError);
  });

  it('throws InvalidCsvError if csv structure is unknown', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: csvConfig.invalidMissingActivity });

    const result: Promise<Stats> = hiscores.getStats(player);

    await expect(result).rejects.toThrow(InvalidCsvError);
  });

  it('InvalidCsvError contains raw csv structure', async () => {
    expect.assertions(1);
    const expected: string = csvConfig.invalidMissingActivity;
    mockAxios.get.mockResolvedValueOnce({ data: expected });

    try {
      await hiscores.getStats(player);
    } catch (err) {
      expect(err.data).toBe(expected);
    }
  });

  it('returns formatted stats when called with default mode', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: csvConfig.valid });

    const stats: Stats = await hiscores.getStats(player);

    expect(stats).toMatchSnapshot();
  });

  it('returns formatted stats when called with specified mode', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: csvConfig.valid });

    const stats: Stats = await hiscores.getStats(player, 'ironman');

    expect(stats).toMatchSnapshot();
  });

  it('calls the correct url endpoint', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: csvConfig.valid });
    const expected = buildStatsUrl(player);

    await hiscores.getStats(player);

    expect(mockAxios.get).toHaveBeenLastCalledWith(expected, expect.any(Object));
  });
});

describe('getDisplayName', () => {
  const hiscores = new Hiscores();

  it('returns display name when ranked on hiscores', async () => {
    const spy = jest.spyOn(hiscores, 'getStats').mockResolvedValueOnce(statsConfig.statsRanked);
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.displayNamePage.valid });

    const displayName: DisplayName = await hiscores.getDisplayName('bobross');

    expect(displayName.format).toBe('BobRoss');
    spy.mockRestore();
  });

  it("throws InvalidHtmlError if the html page doesn't include a highlighted name", async () => {
    const spy = jest.spyOn(hiscores, 'getStats').mockResolvedValueOnce(statsConfig.statsRanked);
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.displayNamePage.invalid });

    const displayName: Promise<DisplayName> = hiscores.getDisplayName('bobross');

    await expect(displayName).rejects.toThrow(InvalidHtmlError);
    spy.mockRestore();
  });

  it('returns unformatted name if there are no ranked skills', async () => {
    const spy = jest.spyOn(hiscores, 'getStats').mockResolvedValueOnce(statsConfig.statsNoRankedSkill);

    const displayName: DisplayName = await hiscores.getDisplayName('bobross');

    expect(displayName.format).toBe('bobross');
    spy.mockRestore();
  });
});

describe('getSkillPage', () => {
  const hiscores = new Hiscores();
  const skill = 'firemaking';

  it('it returns skillrows with default page and mode', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildSkillPageUrl(skill);

    const skillRows: PlayerSkillRow[] = await hiscores.getSkillPage(skill);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(skillRows).toMatchSnapshot();
  });

  it('returns skillrows on specific page and default mode', async () => {
    const page = 5;
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildSkillPageUrl(skill).concat(`&page=${page}`);

    const skillRows: PlayerSkillRow[] = await hiscores.getSkillPage(skill, undefined, page);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(skillRows).toMatchSnapshot();
  });

  it('returns skillrows on default page and specific mode', async () => {
    const mode: Mode = 'hardcore';
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildSkillPageUrl(skill, mode);

    const skillRows: PlayerSkillRow[] = await hiscores.getSkillPage(skill, mode);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(skillRows).toMatchSnapshot();
  });
});

describe('getActivityPage', () => {
  const hiscores = new Hiscores();
  const activity = 'easy';

  it('it returns activity rows with default page and mode', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildActivityPageUrl(activity);

    const activityRows: PlayerActivityRow[] = await hiscores.getActivityPage(activity);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(activityRows).toMatchSnapshot();
  });

  it('returns activity rows on specific page and default mode', async () => {
    const page = 5;
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildActivityPageUrl(activity).concat(`&page=${page}`);

    const activityRows: PlayerActivityRow[] = await hiscores.getActivityPage(activity, undefined, page);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(activityRows).toMatchSnapshot();
  });

  it('returns activity rows on default page and specific mode', async () => {
    const mode: Mode = 'hardcore';
    mockAxios.get.mockResolvedValueOnce({ data: htmlConfig.skillPage.normal });
    const url: string = buildActivityPageUrl(activity, mode);

    const activityRows: PlayerActivityRow[] = await hiscores.getActivityPage(activity, mode);

    expect(mockAxios.get).toHaveBeenLastCalledWith(url, expect.any(Object));
    expect(activityRows).toMatchSnapshot();
  });
});

describe('getMode', () => {
  const hiscores = new Hiscores();

  it('returns `normal` for normal accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (
        url === buildStatsUrl(player, 'ironman') ||
        url === buildStatsUrl(player, 'hardcore') ||
        url === buildStatsUrl(player, 'ultimate')
      ) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('returns `ironman` for ironman accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url === buildStatsUrl(player, 'hardcore') || url === buildStatsUrl(player, 'ultimate')) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('returns `ultimate` for ultimate accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url === buildStatsUrl(player, 'hardcore')) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('returns `hardcore` for hardcore accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url === buildStatsUrl(player, 'ultimate')) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('returns `ironman` for dead hardcore accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url === buildStatsUrl(player, 'ultimate')) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      if (url === buildStatsUrl(player, 'hardcore')) {
        return Promise.resolve({ data: csvConfig.validLessOverallXp });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('returns `normal` for deironed accounts', async () => {
    mockAxios.get.mockImplementation(url => {
      if (url === buildStatsUrl(player, 'ultimate') || url === buildStatsUrl(player, 'hardcore')) {
        return Promise.reject({
          response: {
            status: 404,
          },
        });
      }
      if (url === buildStatsUrl(player, 'ironman')) {
        return Promise.resolve({ data: csvConfig.validLessOverallXp });
      }
      return Promise.resolve({ data: csvConfig.valid });
    });

    const mode: PlayerMode = await hiscores.getMode(player);

    expect(mode).toMatchSnapshot();
  });

  it('throws error when hiscores are unavailable', async () => {
    mockAxios.get.mockRejectedValueOnce({
      response: {
        status: 303,
      },
    });

    const mode: Promise<PlayerMode> = hiscores.getMode(player);

    await expect(mode).rejects.toThrow(ServiceUnavailableError);
  });
});
