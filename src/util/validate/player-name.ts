/**
 * Validates a player name
 *
 * Rules:
 *  - A name must be 1-12 characters long
 *  - A name must only contain alphabetic, numeric, space and underscore characters
 *
 * @param {string} player The player name to validate
 *
 * @returns {boolean} True if name is valid, else False
 */
const isValidPlayerName = (player: string): boolean =>
  typeof player === 'string' && /^[a-zA-Z0-9 _]+$/.test(player) && player.length >= 1 && player.length <= 12;

export default isValidPlayerName;
