import type { GameEvent } from './types';

export const STATIC_EVENTS: GameEvent[] = [
  {
    title: 'Urgent Bug Report',
    description: 'A critical bug has been reported in production. It needs to be fixed ASAP, but you were just about to head home.',
    choices: [
      {
        text: 'Stay late and fix it.',
        effects: {
          energy: -15,
          happiness: -5,
          xp: { skill: 'javascript', amount: 20 },
          personalBrand: 5,
        },
      },
      {
        text: 'Add it to the backlog for tomorrow.',
        effects: {
          energy: 5,
          happiness: 5,
          personalBrand: -3,
        },
      },
    ],
  },
  {
    title: 'Team Lunch Invitation',
    description: 'Your colleagues are going out for lunch at a fancy new place. It\'s a bit pricey, but could be good for team bonding.',
    choices: [
      {
        text: 'Join them. (Cost: $50)',
        effects: {
          money: -50,
          happiness: 10,
          xp: { skill: 'teamwork', amount: 15 },
        },
      },
      {
        text: 'Eat your packed lunch at your desk.',
        effects: {
          energy: 5,
        },
      },
    ],
  },
  {
    title: 'Unsolicited Feedback',
    description: 'A senior developer from another team gives you some unsolicited but potentially valuable feedback on your coding style.',
    choices: [
      {
        text: 'Thank them and reflect on their advice.',
        effects: {
          xp: { skill: 'communication', amount: 10 },
          personalBrand: 3,
        },
      },
      {
        text: 'Ignore it. You know what you\'re doing.',
        effects: {
          happiness: -5,
        },
      },
    ],
  },
  {
    title: 'New Software Update',
    description: 'The company is rolling out a new mandatory software update that is known to be slow and buggy. You have to install it today.',
    choices: [
      {
        text: 'Grin and bear it.',
        effects: {
          happiness: -10,
          energy: -5,
        },
      },
      {
        text: 'Complain about it with a coworker.',
        effects: {
          happiness: -5,
          xp: { skill: 'teamwork', amount: 5 },
        },
      },
    ],
  },
];
