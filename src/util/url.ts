import { Mode, SkillName, ActivityName } from '../types';
import { SKILLS, ACTIVITIES } from './constants';

const urlBase = 'https://secure.runescape.com';
const urlStats = 'index_lite.ws';
const urlScores = 'overall.ws';
const urlMode: { [key: string]: string } = {
  normal: 'm=hiscore_oldschool',
  ironman: 'm=hiscore_oldschool_ironman',
  ultimate: 'm=hiscore_oldschool_ultimate',
  hardcore: 'm=hiscore_oldschool_hardcore_ironman',
  deadman: 'm=hiscore_oldschool_deadman',
  seasonal: 'm=hiscore_oldschool_seasonal',
  tournament: 'm=hiscore_oldschool_tournament',
};

/**
 * Returns the correct url mode
 *
 * @param {Mode} [mode] The game mode to select. Defaults to `normal`
 *
 * @returns {string} The urlMode property
 */
const getUrlModeWithDefault = (mode: Mode = 'normal'): string => urlMode[mode];

/**
 * Builds the url string for personal stats
 *
 * @param {string} player The player name to lookup
 * @param {Mode} [mode] The game mode to select. Defaults to `normal`
 *
 * @returns {string}
 */
export const buildStatsUrl = (player: string, mode?: Mode): string => {
  const urlStatsPlayer = urlStats.concat(`?player=${player}`);
  return [urlBase, getUrlModeWithDefault(mode), urlStatsPlayer].join('/');
};

/**
 * Builds the url string for skill page
 *
 * @param {SkillName} skill The skill name to lookup
 * @param {Mode} [mode] The mode to select. Defaults to `normal`
 *
 * @returns {string}
 */
export const buildSkillPageUrl = (skill: SkillName, mode?: Mode): string => {
  const tableIdx = SKILLS.indexOf(skill);
  const urlScoresTable = urlScores.concat(`?table=${tableIdx}`);
  return [urlBase, getUrlModeWithDefault(mode), urlScoresTable].join('/');
};

/**
 * Builds the url string for activity page
 *
 * @param {ActivityName} activity The activity name to lookup
 * @param {Mode} [mode] The mode to select. Defaults to `normal`
 *
 * @returns {string}
 */
export const buildActivityPageUrl = (activity: ActivityName, mode?: Mode): string => {
  const tableIdx = ACTIVITIES.indexOf(activity);
  const urlScoresTable = urlScores.concat(`?category_type=1&table=${tableIdx}`);
  return [urlBase, getUrlModeWithDefault(mode), urlScoresTable].join('/');
};

/**
 * Builds the url string for formatted player name (highlighted in table)
 *
 * @param {string} player The player to lookup
 * @param {SkillName} [skill] The skill table to use. Defaults to `overall`
 * @param {Mode} [mode] The mode to select. Defaults to `normal`
 *
 * @returns {string}
 */
export const buildSkillPageWithDisplayNameUrl = (player: string, skill?: SkillName, mode?: Mode): string => {
  const defaultOrSkill = skill || 'overall';
  const pageUrl = buildSkillPageUrl(defaultOrSkill, mode);
  return pageUrl.concat(`&user=${player}`);
};
