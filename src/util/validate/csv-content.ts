import { CsvContent } from '../../types';

/**
 * Checks if the array is filled with only numbers
 *
 * @param {string[]} arr Array containing data to be validated as numbers
 * @param {number} length Expected length of `arr`
 *
 * @returns {boolean} True if valid, else False
 */
const isValidData = (arr: string[], length: number): boolean => {
  // needs to be an array of expected length
  if (!Array.isArray(arr) || arr.length !== length) {
    return false;
  }

  // each element of the array needs to be a valid number (empty string invalid)
  return arr.every(element => element.trim() && !Number.isNaN(Number(element)));
};

/**
 * Validates csv content
 *
 * @param {CsvContent} csvContent The content to validate
 *
 * @returns {boolean} True if valid, else False
 */
const isValidCsvContent = (csvContent: CsvContent): boolean => {
  const { skills, activities, remaining } = csvContent;

  const validRemaining = remaining.length === 1 && remaining[0].length === 1 && remaining[0][0] === ''; // newline EOF
  const validSkillData = skills.every(element => isValidData(element, 3)); // 3: rank, level, experience
  const validActivityData = activities.every(element => isValidData(element, 2)); // 2: rank, score

  return validRemaining && validSkillData && validActivityData;
};

export default isValidCsvContent;
