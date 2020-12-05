import cheerio from 'cheerio';
import { PlayerSkillRow, PlayerActivityRow } from '../types';
import { InvalidHtmlError } from '../util/error';

/**
 * Extracts text from html element
 *
 * @param {CheerioElement} element
 *
 * @returns {string}
 */
const textFromElement = (element: CheerioElement | undefined): string => {
  const innerText = element?.firstChild.data;
  return innerText ? innerText.replace(/\uFFFd/g, '') : '';
};

/**
 * Extracts number from html element
 *
 * @param {CheerioElement} element
 *
 * @returns {number}
 */
const numberFromElement = (element: CheerioElement): number => {
  const innerText = element.firstChild.data;
  const number = innerText ? innerText.replace(/,/g, '') : '-1';
  return parseInt(number, 10);
};

/**
 * Parses a hiscore skill table page
 *
 * @param {string} skillPage HTML page of a OSRS hiscore table
 *
 * @returns {PlayerSkillRow[]}
 *
 * @throws {InvalidHtmlError} If html structure is invalid
 */
export const parseSkillPage = (skillPage: string, isHardcore = false): PlayerSkillRow[] => {
  const $ = cheerio.load(skillPage);
  const hiscoreRows = $('.personal-hiscores__row').toArray();

  const players: PlayerSkillRow[] = hiscoreRows.map(row => {
    const cells = row.children.filter(element => element.name === 'td');

    const [rankElement, nameCell, levelElement, experienceElement] = cells;
    const nameElement = nameCell.children.find(element => element.name === 'a');

    const stats = {
      name: textFromElement(nameElement),
      rank: numberFromElement(rankElement),
      level: numberFromElement(levelElement),
      experience: numberFromElement(experienceElement),
    };

    // we only care about death status if it is a hardcore table
    if (isHardcore) {
      const isDead = !!nameCell.children.find(element => element.name === 'img');
      return { ...stats, dead: isDead };
    }

    return stats;
  });

  return players;
};

/**
 * Parses a hiscore activity table page
 *
 * @param {string} activityPage HTML page of a OSRS hiscore table
 *
 * @returns {PlayerActivityRow[]}
 *
 * @throws {InvalidHtmlError} If html structure is invalid
 */
export const parseActivityPage = (activityPage: string, isHardcore = false): PlayerActivityRow[] => {
  const $ = cheerio.load(activityPage);
  const hiscoreRows = $('.personal-hiscores__row').toArray();

  const players: PlayerActivityRow[] = hiscoreRows.map(row => {
    const cells = row.children.filter(element => element.name === 'td');

    const [rankElement, nameCell, scoreElement] = cells;
    const nameElement = nameCell.children.find(element => element.name === 'a');

    const stats = {
      name: textFromElement(nameElement),
      rank: numberFromElement(rankElement),
      score: numberFromElement(scoreElement),
    };

    // we only care about death status if it is a hardcore table
    if (isHardcore) {
      const isDead = !!nameCell.children.find(element => element.name === 'img');
      return { ...stats, dead: isDead };
    }

    return stats;
  });

  return players;
};

/**
 * Parses a display name page to find the highlighted display name
 *
 * @param displayNamePage HTML page of a OSRS hiscore table
 *
 * @returns {string} The display name
 *
 * @throws {InvalidHtmlError} If display name is not found
 */
export const parseDisplayNamePage = (displayNamePage: string): string => {
  const $ = cheerio.load(displayNamePage);
  const displayName = $('[style="color:#AA0022;"]')[1]?.children[0]?.data;

  if (displayName && displayName.length > 0) {
    return displayName.replace(/\uFFFd/g, '');
  }

  throw new InvalidHtmlError('Could not find display name', displayNamePage);
};
