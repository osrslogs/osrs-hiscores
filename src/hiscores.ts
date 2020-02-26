import { Config, Stats, Mode, SkillName, PlayerSkillRow, PlayerActivityRow, ActivityName } from './types';
import request from './request';
import parseCsv from './parser/parse-csv';
import { buildStatsUrl, buildSkillPageWithDisplayNameUrl, buildSkillPageUrl, buildActivityPageUrl } from './util/url';
import isValidPlayerName from './util/validate/player-name';
import { parseDisplayNamePage, parseSkillPage, parseActivityPage } from './parser/parse-html';
import { getRankedStat } from './util/stats';
import { InvalidPlayerError } from './util/error';

class Hiscores {
  readonly config: Config = {
    userAgent: 'osrslogs-hiscores',
  };

  constructor(config?: Config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Fetches the stats for the given player and (optional) mode.
   *
   * @param {string} player The player name to lookup
   * @param {Mode} [mode] The game mode to lookup. Defaults to `normal`
   *
   * @returns {Stats} Player stats formatted as json
   *
   * @throws {InvalidPlayerError} If player name is invalid
   * @throws {ServiceUnavailableError} If hiscores are unavailable
   * @throws {NotFoundError} If hiscores did not find player
   * @throws {HttpError} If hiscores request failed unexpectedly
   * @throws {InvalidCsvError} If the csv had unexpected structure
   */
  async getStats(player: string, mode?: Mode): Promise<Stats> {
    // Validate player name to avoid requests that are guaranteed to 404
    if (!isValidPlayerName(player)) {
      throw new InvalidPlayerError('Player name is invalid');
    }

    const url = buildStatsUrl(player, mode);
    const csv: string = await request(url, this.config);
    return parseCsv(csv);
  }

  /**
   * Finds the players display name (formatted name)
   *
   * @param {string} player The player name to lookup
   * @param {Mode} [mode] The game mode to lookup. Defaults to `normal`
   *
   * @returns {string} The formatted display name if found, else unformatted
   *
   * @throws {InvalidPlayerError} If player name is invalid
   * @throws {ServiceUnavailableError} If hiscores are unavailable
   * @throws {NotFoundError} If hiscores did not find player
   * @throws {HttpError} If hiscores request failed unexpectedly
   * @throws {InvalidHtmlError} If the html had unexpected structure
   */
  async getDisplayName(player: string, mode?: Mode): Promise<string> {
    // Hiscores tables only display the first 2m players in a stat
    // Find a stat the player is ranked in to use as lookup table
    const stats: Stats = await this.getStats(player, mode);
    const rankedSkill: string | undefined = getRankedStat(stats.skills);
    if (rankedSkill) {
      const url = buildSkillPageWithDisplayNameUrl(player, rankedSkill as SkillName, mode);
      const html = await request(url, this.config);
      return parseDisplayNamePage(html);
    }
    return player; // unable to find display name
  }

  /**
   * Fetches a hiscores table page as json
   *
   * @param {SkillName} skill The skill name to get table for
   * @param {Mode} [mode] The game mode to lookup. Defaults to `normal`
   * @param {number} [page] The page number to lookup. Defaults to `0`
   *
   * @returns {PlayerSkillRow[]} Skill table page formatted as json
   *
   * @throws {ServiceUnavailableError} If hiscores are unavailable
   * @throws {HttpError} If hiscores request failed unexpectedly
   * @throws {InvalidHtmlError} If the html had unexpected structure
   */
  async getSkillPage(skill: SkillName, mode?: Mode, page?: number): Promise<PlayerSkillRow[]> {
    let url = buildSkillPageUrl(skill, mode);

    if (page) {
      url = url.concat(`&page=${page}`);
    }

    const html = await request(url, this.config);
    return parseSkillPage(html);
  }

  /**
   * Fetches a hiscores activity table page by activity name
   *
   * @param {Activity} activity The activity name to get table for
   * @param {Mode} [mode] The game mode to lookup. Defaults to `normal`
   * @param {number} [page] The page number to lookup. Defaults to `0`
   *
   * @returns {PlayerActivityRow[]} Activity table page formatted as json
   *
   * @throws {ServiceUnavailableError} If hiscores are unavailable
   * @throws {HttpError} If hiscores request failed unexpectedly
   * @throws {InvalidHtmlError} If the html had unexpected structure
   */
  async getActivityPage(activity: ActivityName, mode?: Mode, page?: number): Promise<PlayerActivityRow[]> {
    let url = buildActivityPageUrl(activity, mode);

    if (page) {
      url = url.concat(`&page=${page}`);
    }

    const html = await request(url, this.config);
    return parseActivityPage(html, mode === 'hardcore');
  }
}

export default Hiscores;
