import { GoogleGenAI, Type } from "@google/genai";
import type { GameState, GameEvent, Job } from '../types';
import { JOB_TIERS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const traitSchema = {
    type: Type.OBJECT,
    description: "A permanent trait, either positive or negative.",
    properties: {
        id: { type: Type.STRING, description: "A unique snake_case id for the trait, e.g., 'early_riser' or 'procrastinator'."},
        name: { type: Type.STRING, description: "The display name of the trait, e.g., 'Early Riser'."},
        description: { type: Type.STRING, description: "A brief description of the trait's effect."},
        type: { type: Type.STRING, enum: ['positive', 'negative'], description: "The type of trait."},
    }
};

const jobSchema = {
    type: Type.OBJECT,
    description: "A job offer object.",
    properties: {
        id: { type: Type.STRING, description: "A unique ID for the job, e.g., 'sr_architect_cloudgiant'."},
        title: { type: Type.STRING },
        company: { type: Type.STRING },
        salary: { type: Type.INTEGER, description: "Salary per week." },
        xpGain: {
            type: Type.OBJECT,
            properties: {
                javascript: { type: Type.INTEGER },
                python: { type: Type.INTEGER },
                cloud: { type: Type.INTEGER },
                communication: { type: Type.INTEGER },
                teamwork: { type: Type.INTEGER },
            }
        },
        skillRequirements: {
            type: Type.OBJECT,
            properties: {
                javascript: { type: Type.INTEGER },
                python: { type: Type.INTEGER },
                cloud: { type: Type.INTEGER },
                communication: { type: Type.INTEGER },
                teamwork: { type: Type.INTEGER },
            }
        },
    }
};


const eventSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A short, engaging title for the event.' },
        description: { type: Type.STRING, description: 'A detailed description of the event scenario.' },
        choices: {
            type: Type.ARRAY,
            description: 'An array of two or three choices for the player.',
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: 'The text for the choice button.' },
                    effects: {
                        type: Type.OBJECT,
                        description: 'The consequences of the choice. Use small, balanced integer values. Negative values decrease stats.',
                        properties: {
                            energy: { type: Type.INTEGER, description: 'Change in energy. E.g., -10 or 5.' },
                            happiness: { type: Type.INTEGER, description: 'Change in happiness. E.g., -5 or 10.' },
                            money: { type: Type.INTEGER, description: 'Change in money. E.g., -50 or 100. For Life-Changing events, this can be much larger.' },
                            personalBrand: { type: Type.INTEGER, description: 'Change in personal brand. E.g., 2 or 5. For Life-Changing events, this can be much larger.' },
                            luck: { type: Type.INTEGER, description: 'Change in luck. E.g., -1 or 2.' },
                            xp: {
                                type: Type.OBJECT,
                                description: 'XP gain for a specific skill.',
                                properties: {
                                    skill: { type: Type.STRING, description: 'The key of the skill to grant XP to (e.g., "javascript").', enum: ['javascript', 'python', 'cloud', 'communication', 'teamwork'] },
                                    amount: { type: Type.INTEGER, description: 'Amount of XP to grant.' },
                                },
                            },
                            addTrait: traitSchema,
                            removeTraitId: { type: Type.STRING, description: "The ID of a trait to remove."},
                            newJob: jobSchema,
                        },
                    },
                    luckThreshold: { type: Type.INTEGER, description: 'Optional. If provided, this choice is only available if the player\'s luck is at or above this value.' },
                },
                 required: ['text', 'effects'],
            },
        },
    },
    required: ['title', 'description', 'choices'],
};

function getNextJobTier(currentJobId: string | undefined): Job | null {
    if (!currentJobId) return JOB_TIERS[0] || null;
    const currentIndex = JOB_TIERS.findIndex(job => job.id === currentJobId);
    if (currentIndex > -1 && currentIndex < JOB_TIERS.length - 1) {
        return JOB_TIERS[currentIndex + 1];
    }
    return null;
}


export async function generateGameEvent(gameState: GameState): Promise<GameEvent | null | 'RATE_LIMIT_ERROR'> {
  try {
    const skillSummary = Object.values(gameState.skills)
        .map(s => `${s.name}: Lvl ${s.level}`)
        .join(', ');
    const traitSummary = gameState.activeTraits.map(t => t.name).join(', ') || 'None';
    const nextTierJob = getNextJobTier(gameState.currentJob?.id);
    
    const testingModeInstruction = gameState.startingPerk === 'testing'
      ? `\nIMPORTANT: The player is in a special "Testing Mode". This means you should generate more extreme, unusual, and high-impact events. Feel free to be more creative, dramatic, and chaotic than usual. The consequences (both positive and negative) should be significantly larger to make testing more dynamic and fun. Prioritize CAREER, TRAIT, and LIFE-CHANGING events over STANDARD events.`
      : '';


    const prompt = `
      You are a game master for an IT career simulator RPG.
      The player is a ${gameState.currentJob?.title || 'Unemployed'}.
      Current Stats: Energy: ${gameState.playerStats.energy}, Happiness: ${gameState.playerStats.happiness}, Luck: ${gameState.playerStats.luck}, Personal Brand: ${gameState.playerStats.personalBrand}.
      Skills: ${skillSummary}.
      Traits: ${traitSummary}.
      ${testingModeInstruction}
      
      Generate a unique and plausible workplace or life event based on ONE of the following types, chosen by its probability.
      Provide a title, a description, and 2-3 distinct choices. Each choice must have clear stat consequences.

      EVENT TYPE (CHOOSE ONE):
      
      1. STANDARD EVENT (75% chance): A regular workplace/life event with small, balanced consequences.
         - Example: A colleague asks for help. Choice A: Help (lose energy, gain teamwork XP). Choice B: Decline (save energy).

      2. CAREER OPPORTUNITY EVENT (10% chance): An event focused on professional growth and recognition, more likely if Personal Brand is high. It can result in a direct job offer.
         - Example Scenario: "A recruiter from a rival company was impressed by your work on the latest project and reached out with an offer."
         - One of the choices MUST include a 'newJob' effect.
         - The new job should be a clear promotion, like the next career tier: ${nextTierJob ? JSON.stringify(nextTierJob) : "a senior role"}. It could even be a tier above that if the player is doing exceptionally well.

      3. TRAIT EVENT (10% chance): An event that can result in gaining a new permanent trait.
         - Example Positive Trait: 'Focused Coder' (boosts skill XP gain).
         - If a choice gives a NEGATIVE trait, ALWAYS provide a THIRD, high-luck option (luckThreshold: 30+) that AVOIDS the negative trait and ideally grants a positive one.
      
      4. LIFE-CHANGING EVENT (5% chance): A truly rare and memorable event that can fundamentally reshape the player's career and life. These should be narrative-driven and feel like major turning points. The consequences should be massive.
         - IF PLAYER LUCK IS HIGH (> 40): Generate a "once-in-a-lifetime" positive event. Be creative!
           - Examples: Your open-source side project gets acquired by a major tech company (money: +50000, personalBrand: +100). You receive an unexpected inheritance from a long-lost relative (money: +75000). You win a prestigious coding competition against all odds (personalBrand: +75, money: +20000, gain 'Coding Prodigy' trait). A stock tip from a friend turns out to be golden (money: +40000).
         - IF PLAYER LUCK IS LOW (< 15): Generate a dramatic, challenging negative event.
           - Examples: You are the victim of a sophisticated identity theft, freezing your assets and causing immense stress (money: -10000, happiness: -40). A critical server you maintained crashes, causing a massive data loss for your company, putting your job at extreme risk (personalBrand: -50, happiness: -30). A natural disaster floods your apartment, destroying your belongings (money: -15000).
         - The stat changes for these events should be an order of magnitude larger than standard events.
         - For negative events, ALWAYS include a high-luck "miracle" choice (luckThreshold: 50+) that not only mitigates the disaster but might even turn it into a slight positive.
      
      The tone should be slightly dramatic but realistic. Ensure trait and job IDs are unique and in snake_case.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: eventSchema,
        }
    });
    
    const eventJson = JSON.parse(response.text.trim());

    // Basic validation
    if (eventJson.title && eventJson.description && Array.isArray(eventJson.choices) && eventJson.choices.length > 0) {
      return eventJson as GameEvent;
    }
    console.warn('Received malformed event from Gemini:', eventJson);
    return null;

  } catch (error: any) {
    console.error('Error generating game event with Gemini:', error);
    
    // Check for rate limit error in different possible structures
    if (error?.error?.status === 'RESOURCE_EXHAUSTED') {
        return 'RATE_LIMIT_ERROR';
    }

    const errorString = (typeof error === 'object' && error !== null ? JSON.stringify(error) : String(error)).toLowerCase();
    if (errorString.includes('429') || errorString.includes('resource_exhausted') || errorString.includes('quota')) {
        return 'RATE_LIMIT_ERROR';
    }
    
    return null;
  }
}