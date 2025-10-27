import { GameState, Skill, Job, Activity, Education, Hobby } from './types';

export const SKILL_DEFINITIONS: { [key: string]: Omit<Skill, 'level' | 'xp'> } = {
  javascript: { name: 'JavaScript', xpToNextLevel: 100 },
  python: { name: 'Python', xpToNextLevel: 100 },
  cloud: { name: 'Cloud Infra', xpToNextLevel: 100 },
  communication: { name: 'Communication', xpToNextLevel: 50 },
  teamwork: { name: 'Teamwork', xpToNextLevel: 50 },
};

export const JOB_TIERS: Job[] = [
    { 
        id: 'jr_dev_webcorp', 
        title: 'Junior Developer', 
        company: 'WebCorp', 
        salary: 1300, 
        xpGain: { javascript: 26, python: 7, cloud: 7, communication: 13, teamwork: 20 },
        skillRequirements: { javascript: 1, communication: 1 }
    },
    { 
        id: 'jr_dev_datanex', 
        title: 'Junior Analyst', 
        company: 'DataNex', 
        salary: 1450, 
        xpGain: { python: 26, javascript: 7, cloud: 7, communication: 13, teamwork: 20 },
        skillRequirements: { python: 1, communication: 1 }
    },
    {
        id: 'mid_dev_webcorp',
        title: 'Mid-Level Developer',
        company: 'WebCorp',
        salary: 2350,
        xpGain: { javascript: 40, cloud: 20, teamwork: 26, communication: 20 },
        skillRequirements: { javascript: 5, cloud: 3, teamwork: 3 }
    },
    {
        id: 'mid_dev_cloudrise',
        title: 'Cloud Engineer',
        company: 'CloudRise',
        salary: 2600,
        xpGain: { cloud: 45, python: 26, teamwork: 20, communication: 13 },
        skillRequirements: { cloud: 5, python: 3, teamwork: 3 }
    },
    {
        id: 'sr_dev_innovatech',
        title: 'Senior Developer',
        company: 'InnovaTech',
        salary: 3900,
        xpGain: { javascript: 52, python: 33, cloud: 33, communication: 26, teamwork: 26 },
        skillRequirements: { javascript: 10, python: 7, cloud: 7, communication: 7 }
    },
    {
        id: 'tech_lead_innovatech',
        title: 'Tech Lead',
        company: 'InnovaTech',
        salary: 5850,
        xpGain: { communication: 52, teamwork: 52, javascript: 26, python: 26, cloud: 26 },
        skillRequirements: { communication: 15, teamwork: 15, javascript: 12, python: 12 }
    }
];

export const PERSONAL_ACTIVITIES: Activity[] = [
  {
    id: 'rest_home',
    name: 'Relax at Home',
    description: 'A quiet week watching series and ordering food.',
    cost: 150,
    effects: {
      energy: 20,
      happiness: 10,
    }
  },
  {
    id: 'weekend_trip',
    name: 'Weekend Getaway',
    description: 'A short trip to the countryside to clear your head.',
    cost: 400,
    effects: {
      energy: 35,
      happiness: 15,
    }
  },
  {
    id: 'spa_day',
    name: 'Luxury Spa & Massage',
    description: 'Treat yourself to a full day of pampering.',
    cost: 700,
    effects: {
      energy: 40,
      happiness: 25,
    }
  },
  {
    id: 'vacation',
    name: 'One-Week Vacation',
    description: 'Fly to a tropical island. No work, no worries.',
    cost: 2000,
    effects: {
      energy: 80,
      happiness: 40,
    }
  },
];

export const HOBBIES: Hobby[] = [
    {
        id: 'hobby_gaming',
        name: 'Gaming',
        description: 'Relax by playing video games. A good way to de-stress.',
        costPerWeek: 50,
        energyPerWeek: 5,
        luckGainChance: 0.10,
    },
    {
        id: 'hobby_gym',
        name: 'Going to the Gym',
        description: 'Stay fit and healthy. It\'s tough but rewarding.',
        costPerWeek: 80,
        energyPerWeek: 10,
        luckGainChance: 0.15,
    },
    {
        id: 'hobby_side_project',
        name: 'Side Projects',
        description: 'Work on personal coding projects. Can be draining but might pay off.',
        costPerWeek: 30,
        energyPerWeek: 15,
        luckGainChance: 0.20,
    }
];

export const EDUCATION_OPTIONS: Education[] = [
    {
        id: 'course_js_basics',
        name: 'JavaScript Basics',
        description: 'A one-week crash course on the fundamentals of JavaScript.',
        type: 'course',
        cost: 500,
        durationWeeks: 1,
        skill: 'javascript',
        rewards: { xp: 50 }
    },
    {
        id: 'course_python_data',
        name: 'Python for Data Intro',
        description: 'Learn the basics of Pandas and NumPy in a week.',
        type: 'course',
        cost: 600,
        durationWeeks: 1,
        skill: 'python',
        rewards: { xp: 60 }
    },
    {
        id: 'course_cloud_intro',
        name: 'Introduction to Cloud',
        description: 'Understand the difference between IaaS, PaaS, and SaaS.',
        type: 'course',
        cost: 700,
        durationWeeks: 1,
        skill: 'cloud',
        rewards: { xp: 70 }
    },
    {
        id: 'training_fullstack',
        name: 'Full-Stack Bootcamp',
        description: 'An intensive 4-week program covering front-end and back-end development.',
        type: 'training',
        cost: 4000,
        durationWeeks: 4,
        skill: 'javascript',
        requirements: { javascript: 5 },
        rewards: { xp: 300, personalBrand: 10 }
    },
    {
        id: 'training_cloud_architect',
        name: 'Cloud Architect Bootcamp',
        description: 'A deep dive into designing and deploying scalable cloud infrastructure.',
        type: 'training',
        cost: 5000,
        durationWeeks: 4,
        skill: 'cloud',
        requirements: { cloud: 5, python: 3 },
        rewards: { xp: 350, personalBrand: 15 }
    },
    {
        id: 'cert_cloud_practitioner',
        name: 'Certified Cloud Practitioner',
        description: 'Prove your foundational cloud knowledge with an industry-recognized certification.',
        type: 'certification',
        cost: 2000,
        durationWeeks: 2,
        skill: 'cloud',
        requirements: { cloud: 8 },
        rewards: {
            xp: 150,
            personalBrand: 20,
            awardTrait: {
                id: 'trait_cert_cloud_practitioner',
                name: 'Certified Cloud Practitioner',
                description: 'Your expertise in cloud computing is officially recognized, boosting job prospects.',
                type: 'positive'
            }
        }
    },
    {
        id: 'cert_js_specialist',
        name: 'Advanced JavaScript Specialist',
        description: 'A certification that validates your deep understanding of advanced JS concepts.',
        type: 'certification',
        cost: 2500,
        durationWeeks: 3,
        skill: 'javascript',
        requirements: { javascript: 10 },
        rewards: {
            xp: 200,
            personalBrand: 25,
            awardTrait: {
                id: 'trait_cert_js_specialist',
                name: 'Certified JS Specialist',
                description: 'You are a recognized expert in JavaScript, opening doors to senior roles.',
                type: 'positive'
            }
        }
    }
];

export const EVENT_CHANCE = 0.25; // Increased from 0.20 for more frequent events
export const AI_EVENT_CHANCE_VS_STATIC = 0.20; // 20% of events will be AI-generated, the rest will be static.


export const INITIAL_GAME_STATE: GameState = {
  playerStats: {
    energy: 100,
    happiness: 80,
    money: 500,
    personalBrand: 0,
    luck: 10,
  },
  skills: {
    javascript: { ...SKILL_DEFINITIONS['javascript'], level: 1, xp: 0 },
    python: { ...SKILL_DEFINITIONS['python'], level: 1, xp: 0 },
    cloud: { ...SKILL_DEFINITIONS['cloud'], level: 1, xp: 0 },
    communication: { ...SKILL_DEFINITIONS['communication'], level: 1, xp: 0 },
    teamwork: { ...SKILL_DEFINITIONS['teamwork'], level: 1, xp: 0 },
  },
  currentJob: JOB_TIERS[0],
  currentEvent: null,
  log: ['Choose your starting perk to begin your IT career!'],
  time: {
    week: 1,
    year: 1,
  },
  gamePhase: 'perk-selection',
  isGeneratingEvent: false,
  startingPerk: null,
  activeTraits: [],
  jobOffers: [],
  currentHobby: null,
};
