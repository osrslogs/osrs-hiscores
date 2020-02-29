import { AxiosProxyConfig } from 'axios';

export type Mode = 'normal' | 'ironman' | 'ultimate' | 'hardcore' | 'deadman' | 'seasonal' | 'tournament';

export type SkillName =
  | 'overall'
  | 'attack'
  | 'defence'
  | 'strength'
  | 'hitpoints'
  | 'ranged'
  | 'prayer'
  | 'magic'
  | 'cooking'
  | 'woodcutting'
  | 'fletching'
  | 'fishing'
  | 'firemaking'
  | 'crafting'
  | 'smithing'
  | 'mining'
  | 'herblore'
  | 'agility'
  | 'thieving'
  | 'slayer'
  | 'farming'
  | 'runecraft'
  | 'hunter'
  | 'construction';

export type BossName =
  | 'abyssalSire'
  | 'alchemicalHydra'
  | 'barrowsChests'
  | 'bryophyta'
  | 'callisto'
  | 'cerberus'
  | 'chambersOfXeric'
  | 'chambersOfXericChallengeMode'
  | 'chaosElemental'
  | 'chaosFanatic'
  | 'commanderZilyana'
  | 'corporealBeast'
  | 'crazyArchaeologist'
  | 'dagannothPrime'
  | 'dagannothRex'
  | 'dagannothSupreme'
  | 'derangedArchaeologist'
  | 'generalGraardor'
  | 'giantMole'
  | 'grotesqueGuardians'
  | 'hespori'
  | 'kalphiteQueen'
  | 'kingBlackDragon'
  | 'kraken'
  | 'kreeArra'
  | 'krilTsutsaroth'
  | 'mimic'
  | 'nightmare'
  | 'obor'
  | 'sarachnis'
  | 'scorpia'
  | 'skotizo'
  | 'theGauntlet'
  | 'theCorruptedGauntlet'
  | 'theatreOfBlood'
  | 'thermonuclearSmokeDevil'
  | 'tzKalZuk'
  | 'tzTokJad'
  | 'venenatis'
  | 'vetion'
  | 'vorkath'
  | 'wintertodt'
  | 'zalcano'
  | 'zulrah';

export type ClueType = 'all' | 'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master';

export type LeaguePoints = 'leaguePoints';

export type lastManStanding = 'lastManStanding';

export type BountyHunterType = 'hunter' | 'rogue';

export type ActivityName = LeaguePoints | BountyHunterType | ClueType | lastManStanding | BossName;

export type StatName = ActivityName | SkillName;

export interface Config {
  userAgent?: string;
  timeout?: number;
  proxy?: AxiosProxyConfig;
}

export interface RankedStat {
  rank: number;
}

export interface Activity extends RankedStat {
  rank: number;
  score: number;
}

export interface Skill extends RankedStat {
  rank: number;
  level: number;
  experience: number;
}

export interface CsvContent {
  skills: string[][];
  activities: string[][];
  remaining: string[][];
}

export interface PlayerSkillRow extends Skill {
  name: string;
  dead?: boolean; // only included on hc skill rows
}

export interface PlayerActivityRow extends Activity {
  name: string;
  dead?: boolean; // only included on hc activty rows
}

export type RankedStats = {
  [name in string]: RankedStat;
};

export type Skills = {
  [name in SkillName]: Skill;
};

export type Activities = {
  [name in ActivityName]: Activity;
};

export type Bosses = {
  [name in BossName]: Activity;
};

export type Clues = {
  [name in ClueType]: Activity;
};

export type BountyHunter = {
  [name in BountyHunterType]: Activity;
};

export interface Stats {
  skills: Skills;
  leaguePoints: Activity;
  bountyHunter: BountyHunter;
  clues: Clues;
  lastManStanding: Activity;
  bosses: Bosses;
}

export interface DisplayName {
  format: string;
}
