export type Perk = 'happy' | 'rich' | 'fortunate' | 'influencer' | 'testing' | null;
export type GamePhase = 'perk-selection' | 'playing' | 'game-over' | 'job-market' | 'performance-review';

export interface Skill {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface PlayerStats {
  energy: number;
  happiness: number;
  money: number;
  personalBrand: number;
  luck: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: number; // per week
  xpGain: { [key: string]: number };
  skillRequirements: { [key: string]: number };
}

export interface Trait {
    id: string;
    name: string;
    description: string;
    type: 'positive' | 'negative';
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: {
    energy: number;
    happiness: number;
  };
}

export interface Hobby {
  id: string;
  name: string;
  description: string;
  costPerWeek: number;
  energyPerWeek: number;
  luckGainChance: number; // A number between 0 and 1
}

export interface Education {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'training' | 'certification';
  cost: number;
  durationWeeks: number;
  skill: keyof GameState['skills'];
  requirements?: {
    [key in keyof GameState['skills']]?: number;
  };
  rewards: {
    xp: number;
    personalBrand?: number;
    awardTrait?: Trait;
  }
}

export interface GameEventChoice {
  text: string;
  effects: {
    energy?: number;
    happiness?: number;
    money?: number;
    personalBrand?: number;
    luck?: number;
    xp?: { skill: string; amount: number };
    addTrait?: Trait;
    removeTraitId?: string;
    newJob?: Job; // For life-changing events
  };
  luckThreshold?: number;
}

export interface GameEvent {
  title: string;
  description: string;
  choices: GameEventChoice[];
}

export interface GameState {
  playerStats: PlayerStats;
  skills: {
    javascript: Skill;
    python: Skill;
    cloud: Skill;
    communication: Skill;
    teamwork: Skill;
  };
  currentJob: Job | null;
  currentEvent: GameEvent | null;
  log: string[];
  time: {
    week: number;
    year: number;
  };
  gamePhase: GamePhase;
  isGeneratingEvent: boolean;
  startingPerk: Perk;
  activeTraits: Trait[];
  salaryBonus?: number; // For Boháč (rich) perk
  jobOffers: Job[];
  performanceReview?: {
    promotionOffer: Job | null;
    negotiationResult?: 'success' | 'fail' | null;
  };
  currentHobby: Hobby | null;
}