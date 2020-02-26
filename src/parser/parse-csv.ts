import { Stats, CsvContent, Activity, Skill, Skills, SkillName, Activities, ActivityName } from '../types';
import { SKILLS, ACTIVITIES, BOUNTY_HUNTER, CLUES, BOSSES } from '../util/constants';
import isValidCsvContent from '../util/validate/csv-content';
import { InvalidCsvError } from '../util/error';

/**
 * Creates Activities from key-value pairs
 *
 * @param {ActivityName[]} keys
 * @param {Activity[]} values
 *
 * @returns {Activities}
 */
const mapActivities = (keys: ActivityName[], values: Activity[]): Activities => {
  const activities: Activities = {} as Activities;
  keys.forEach((key: ActivityName, idx: number) => {
    activities[key] = values[idx];
  });
  return activities;
};

/**
 * Creates Skills from key-value pairs
 *
 * @param {SkillName[]} keys
 * @param {Skill[]} values
 *
 * @returns {Skills}
 */
const mapSkills = (keys: SkillName[], values: Skill[]): Skills => {
  const skills: Skills = {} as Skills;
  keys.forEach((key: SkillName, idx: number) => {
    skills[key] = values[idx];
  });
  return skills;
};

/**
 * Converts csv activity data into Activity objects
 *
 * @param {string[][]} activities
 *
 * @returns {Activity[]}
 */
const createActivityArray = (activities: string[][]): Activity[] =>
  activities.map(activity => {
    const [rank, score] = activity;
    return {
      rank: Number(rank),
      score: Number(score),
    };
  });

/**
 * Converts csv skill data into Skill objects
 *
 * @param {string[][]} skills
 *
 * @returns {Skill[]}
 */
const createSkillArray = (skills: string[][]): Skill[] =>
  skills.map(skill => {
    const [rank, level, experience] = skill;
    return {
      rank: Number(rank),
      level: Number(level),
      experience: Number(experience),
    };
  });

/**
 * Maps CsvContent to Stats by following the order they appear on OSRS hiscores
 *
 * @param {CsvContent} content The skill content
 *
 * @returns {Stats} The parsed csv formatted as json
 */
const contentToStats = (content: CsvContent): Stats => {
  const skillArr = createSkillArray(content.skills);
  const activityArr = createActivityArray(content.activities);

  const skills: Skills = mapSkills(SKILLS, skillArr);

  const leaguePoints: Activity = activityArr.splice(0, 1)[0]; // don't nest single values (only one LP entry)

  const bountyHunterArr: Activity[] = activityArr.splice(0, BOUNTY_HUNTER.length);
  const bountyHunter: Activities = mapActivities(BOUNTY_HUNTER, bountyHunterArr);

  const clueArr: Activity[] = activityArr.splice(0, CLUES.length);
  const clues: Activities = mapActivities(CLUES, clueArr);

  const lastManStanding: Activity = activityArr.splice(0, 1)[0]; // don't nest single values (only one LMS entry)

  const bosses: Activities = mapActivities(BOSSES, activityArr); // only bosses remaining in the array

  return {
    skills,
    leaguePoints,
    bountyHunter,
    clues,
    lastManStanding,
    bosses,
  };
};

/**
 * Extract skills and activities from a csv
 *
 * @param {string} csv The csv containing stats
 *
 * @returns {CsvContent} Contents of the csv split into arrays
 */
const csvToContent = (csv: string): CsvContent => {
  const lines: string[] = csv.split('\n');
  const elements: string[][] = lines.map(stat => stat.split(','));

  const skills = elements.splice(0, SKILLS.length);
  const activities = elements.splice(0, ACTIVITIES.length);

  return {
    skills,
    activities,
    remaining: elements, // leftover elements after separating out known skills and activities
  };
};

/**
 * Parses a csv string to json object
 *
 * @param {string} csv The csv containing player stats
 *
 * @returns {Stats} The parsed csv formatted as json
 *
 * @throws {InvalidCsvError} If the csv had unexpected structure
 */
const parseCsv = (csv: string): Stats => {
  const content: CsvContent = csvToContent(csv);

  if (!isValidCsvContent(content)) {
    throw new InvalidCsvError(csv);
  }

  return contentToStats(content);
};

export default parseCsv;
