import React, { useState, useCallback, useEffect, useRef } from 'react';
import { produce } from 'immer';
import { INITIAL_GAME_STATE, EVENT_CHANCE, JOB_TIERS, PERSONAL_ACTIVITIES, EDUCATION_OPTIONS, HOBBIES, AI_EVENT_CHANCE_VS_STATIC } from './constants';
import { STATIC_EVENTS } from './staticEvents';
import type { GameState, GameEventChoice, Perk, Job, Trait, Activity, Education, Hobby } from './types';
import { generateGameEvent } from './services/geminiService';
import StatDisplay from './components/StatDisplay';
import SkillComponent from './components/Skill';
import EventModal from './components/EventModal';
import PerkSelectionScreen from './components/PerkSelectionScreen';
import ActivitiesModal from './components/ActivitiesModal';
import EducationModal from './components/EducationModal';
import HobbiesModal from './components/HobbiesModal';
import LoadGamePrompt from './components/LoadGamePrompt';


// Icons
const EnergyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const HappinessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4a1 1 0 011 1v10a1 1 0 01-1 1h-4v-1m-6-8h12M6 6h12v12H6V6z" /></svg>;
const BrandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const CloverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 011.06.44l.953.953a.5.5 0 00.707-.707L11.76 3.24a2.5 2.5 0 00-3.52 0L7.28 4.197a.5.5 0 00.707.707l.953-.953A1.5 1.5 0 0110 3.5zm-3.5 6a1.5 1.5 0 01.44-1.06l.953-.953a.5.5 0 00-.707-.707l-.953.953a2.5 2.5 0 000 3.52l.953.953a.5.5 0 00.707-.707l-.953-.953A1.5 1.5 0 016.5 9.5zm7 0a1.5 1.5 0 01-1.06 1.06l-.953.953a.5.5 0 00.707.707l.953-.953a2.5 2.5 0 000-3.52l-.953-.953a.5.5 0 00-.707-.707l.953.953c.293.293.44.684.44 1.06zm-3.5 3.5a1.5 1.5 0 01-1.06.44l-.953-.953a.5.5 0 00-.707.707l.953.953a2.5 2.5 0 003.52 0l.953-.953a.5.5 0 00-.707-.707l-.953.953a1.5 1.5 0 01-1.06-.44z" /></svg>;
const HobbyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 014 10zm11.25-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM10 4a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 4zm0 11.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" /></svg>;


const PERK_DETAILS: { [key in NonNullable<Perk>]: Trait } = {
    happy: { id: 'perk_happy', name: 'Šťastlivec (Happy Camper)', description: 'Happiness never drops below 90.', type: 'positive' },
    rich: { id: 'perk_rich', name: 'Boháč (High Roller)', description: 'Earn a dynamic weekly salary bonus.', type: 'positive' },
    fortunate: { id: 'perk_fortunate', name: 'Štístko (Fortunate)', description: 'High starting luck, but -20% passive XP gain.', type: 'positive' },
    influencer: { id: 'perk_influencer', name: 'Cutiepie (Influencer)', description: '+50% Personal Brand from events.', type: 'positive' },
    testing: { id: 'perk_testing', name: 'Testovací režim', description: 'Získejte 4x více peněz a zkušeností každý týden. Šance na událost je také 4x vyšší.', type: 'positive' },
};

// Modals
const JobMarketModal: React.FC<{ offers: Job[], onAccept: (job: Job) => void, onClose: () => void }> = ({ offers, onAccept, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-700">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Job Market</h2>
                {offers.length === 0 ? <p className="text-gray-400">No suitable job offers available right now. Keep improving your skills!</p> : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {offers.map(job => (
                            <div key={job.id} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-xl font-bold">{job.title} at {job.company}</h3>
                                <p className="text-green-400 font-mono">${job.salary}/week</p>
                                <p className="text-sm text-gray-400 mt-2">Requires: {Object.entries(job.skillRequirements).map(([s, l]) => `${s} Lvl ${l}`).join(', ')}</p>
                                <button onClick={() => onAccept(job)} className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Accept Offer</button>
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">Close</button>
            </div>
        </div>
    </div>
);

const PerformanceReviewModal: React.FC<{ onAccept: () => void, onDecline: () => void, onNegotiate: () => void, offer: Job | null, negotiationResult?: 'success' | 'fail' | null }> = ({ onAccept, onDecline, onNegotiate, offer, negotiationResult }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Annual Performance Review</h2>
            {offer ? (
                <>
                    <p className="text-gray-300 mb-4">Your performance has been reviewed. You've been offered a promotion to {offer.title} with a new salary of ${offer.salary}/week!</p>
                    {negotiationResult === 'success' && <p className="text-green-400 font-bold mb-4">Negotiation successful! Your new salary is even higher!</p>}
                    {negotiationResult === 'fail' && <p className="text-red-500 font-bold mb-4">Negotiation failed! The company has withdrawn its offer.</p>}
                    <div className="flex gap-4">
                        <button onClick={onAccept} className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">Accept</button>
                        <button onClick={onNegotiate} className="flex-1 px-4 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700">Negotiate</button>
                        <button onClick={onDecline} className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">Decline & Resign</button>
                    </div>
                </>
            ) : (
                 <p className="text-gray-300 mb-4">Your contract is up. It's time to find a new job.</p>
            )}
             {!offer &&  <button onClick={onDecline} className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Find New Job</button>}
        </div>
    </div>
);

const SAVE_GAME_KEY = 'itCareerSimulatorSave';

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isHobbiesModalOpen, setIsHobbiesModalOpen] = useState(false);
  const [apiCooldown, setApiCooldown] = useState(false);
  const isFetchingEvent = useRef(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (savedData) {
        const savedState: GameState = JSON.parse(savedData);
        if (savedState && savedState.playerStats && savedState.time) {
            // Sanitize transient state properties
            savedState.isGeneratingEvent = false;
            savedState.currentEvent = null;
            setSavedGame(savedState);
        }
      }
    } catch (error) {
      console.error("Failed to load game data, starting fresh.", error);
      localStorage.removeItem(SAVE_GAME_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (gameState.gamePhase === 'playing' || gameState.gamePhase === 'job-market' || gameState.gamePhase === 'performance-review') {
      try {
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
      } catch (error) {
        console.error("Failed to save game state:", error);
      }
    }
  }, [gameState, isLoading]);

  const addLog = useCallback((message: string) => {
    setGameState(prev => produce(prev, draft => {
      draft.log.unshift(message);
      if (draft.log.length > 100) draft.log.pop();
    }));
  }, []);

  const handleSelectPerk = useCallback((perk: Perk) => {
    setGameState(produce(INITIAL_GAME_STATE, draft => {
      draft.startingPerk = perk;
      draft.gamePhase = 'playing';
      if (perk) {
        const perkTrait = PERK_DETAILS[perk];
        draft.activeTraits.push(perkTrait);

        switch (perk) {
          case 'happy': draft.playerStats.happiness = 90; break;
          case 'rich': draft.salaryBonus = Math.random() * 0.75 + 0.25; break;
          case 'fortunate': draft.playerStats.luck = 50; break;
          case 'testing': draft.playerStats.luck = 100; break;
        }
        draft.log = [`You chose the '${perkTrait.name}' perk.`, 'Your IT career begins! You start as a Junior Developer at WebCorp.'];
      }
    }));
  }, []);

  const handleLevelUp = useCallback((skillKey: keyof GameState['skills']) => {
    setGameState(prev => produce(prev, draft => {
      const skill = draft.skills[skillKey];
      if (skill) {
        skill.level += 1;
        skill.xp = skill.xp - skill.xpToNextLevel;
        skill.xpToNextLevel = Math.floor(skill.xpToNextLevel * 1.5);
        const happinessGain = 10;
        draft.playerStats.happiness = Math.min(100, draft.playerStats.happiness + happinessGain);
        addLog(`🎉 LEVEL UP! ${skill.name} is now level ${skill.level}.`);
      }
    }));
  }, [addLog]);

  useEffect(() => {
    for (const key in gameState.skills) {
      const skillKey = key as keyof GameState['skills'];
      if (gameState.skills[skillKey].xp >= gameState.skills[skillKey].xpToNextLevel) {
        handleLevelUp(skillKey);
      }
    }
  }, [gameState.skills, handleLevelUp]);
  
  const handleGameOver = useCallback((reason: string) => {
    addLog(`GAME OVER: ${reason}`);
    setGameState(prev => produce(prev, draft => {
      draft.gamePhase = 'game-over';
    }));
  }, [addLog]);

  const updateJobOffers = useCallback(() => {
    setGameState(prev => produce(prev, draft => {
        const newOffers: Job[] = [];
        JOB_TIERS.forEach(job => {
            if (job.id === draft.currentJob?.id) return;
            const meetsReqs = Object.entries(job.skillRequirements).every(([skillKey, reqLevel]) => {
                return draft.skills[skillKey as keyof GameState['skills']]?.level >= reqLevel;
            });
            if (meetsReqs) {
                newOffers.push(job);
            }
        });
        draft.jobOffers = newOffers;
    }));
  }, []);

  useEffect(() => {
    if (gameState.gamePhase !== 'playing') return;
    if (gameState.playerStats.energy <= 0) handleGameOver("You've burned out from exhaustion.");
    if (gameState.playerStats.happiness <= 0) handleGameOver("You became too unhappy to continue your career.");
    if (!gameState.currentJob && gameState.playerStats.money < 0) handleGameOver("You've gone bankrupt.");
  }, [gameState.gamePhase, gameState.playerStats, gameState.currentJob, handleGameOver]);

  const advanceWeek = useCallback((activity?: Activity) => {
    setGameState(prev => produce(prev, draft => {
      if (draft.gamePhase !== 'playing') return;

      const performSingleWeekUpdate = () => {
          if (draft.time.week === 52) {
              draft.gamePhase = 'performance-review';
              const currentJobIndex = JOB_TIERS.findIndex(j => j.id === draft.currentJob?.id);
              const promotion = (currentJobIndex !== -1 && currentJobIndex < JOB_TIERS.length - 1) ? JOB_TIERS[currentJobIndex + 1] : null;
              
              if(promotion && Object.entries(promotion.skillRequirements).every(([s,l]) => draft.skills[s as keyof GameState['skills']]?.level >= l)) {
                  draft.performanceReview = { promotionOffer: promotion };
                  addLog("It's the end of the year! Time for your performance review.");
              } else {
                  draft.performanceReview = { promotionOffer: null };
                  draft.currentJob = null;
                  addLog("Your yearly contract is up. It's time to find a new position.");
              }
              return; // Exit the function
          }

          draft.time.week += 1;
        
          const testingMultiplier = draft.startingPerk === 'testing' ? 4 : 1;

          if (draft.currentHobby) {
              const hobby = draft.currentHobby;
              draft.playerStats.money -= hobby.costPerWeek;
              if (draft.startingPerk !== 'testing') {
                  draft.playerStats.energy = Math.max(0, draft.playerStats.energy - hobby.energyPerWeek);
              }
              if (Math.random() < hobby.luckGainChance) {
                  draft.playerStats.luck += 1;
                  addLog(`Your hobby '${hobby.name}' paid off! You feel luckier. (+1 Luck)`);
              }
          }

          if(draft.currentJob) {
              let salary = parseInt(String(draft.currentJob.salary), 10) || 0;
              let salaryLogMessage = '';
              if (draft.startingPerk === 'rich') {
                draft.salaryBonus = Math.random() * 0.75 + 0.25;
                const bonusAmount = Math.floor(salary * draft.salaryBonus);
                salary += bonusAmount;
                salaryLogMessage = ` (+$${bonusAmount.toLocaleString()} bonus)`;
              }
              salary *= testingMultiplier;
              draft.playerStats.money += salary;
               if (draft.startingPerk === 'testing' && testingMultiplier > 1) {
                  salaryLogMessage += ` (x${testingMultiplier} Testing Bonus)`;
              }
              addLog(`Week ${draft.time.week}, Year ${draft.time.year}: Earned $${salary.toLocaleString()}${salaryLogMessage}.`);

              Object.entries(draft.currentJob.xpGain).forEach(([key, value]) => {
                const skillKey = key as keyof GameState['skills'];
                if (draft.skills[skillKey]) {
                  let xpGained = parseInt(String(value), 10) || 0;
                  if (draft.startingPerk === 'fortunate') xpGained = Math.floor(xpGained * 0.8);
                  xpGained *= testingMultiplier;
                  draft.skills[skillKey].xp += xpGained;
                }
              });
          } else {
               if (draft.startingPerk === 'testing') {
                  const stipend = 2000;
                  draft.playerStats.money += stipend;
                  addLog(`Week ${draft.time.week}, Year ${draft.time.year}: Received $${stipend} Testing Mode stipend while unemployed.`);
              } else {
                  draft.playerStats.money -= 200; // living expenses
                  addLog(`Week ${draft.time.week}, Year ${draft.time.year}: Paid $200 for living expenses.`);
              }
          }

          if (draft.startingPerk !== 'testing') {
              draft.playerStats.energy = Math.max(0, draft.playerStats.energy - 7);
              draft.playerStats.happiness = Math.max(0, draft.playerStats.happiness - 1);
          }

          if (draft.time.week % 13 === 0) updateJobOffers();

          if (!draft.currentEvent && !draft.isGeneratingEvent) {
              let currentEventChance = EVENT_CHANCE + (draft.playerStats.luck * 0.005);
              currentEventChance *= testingMultiplier;

              if (Math.random() < currentEventChance) {
                  if (Math.random() < AI_EVENT_CHANCE_VS_STATIC) {
                      // AI Event
                      draft.isGeneratingEvent = true;
                  } else {
                      // Static Event
                      const staticEvent = STATIC_EVENTS[Math.floor(Math.random() * STATIC_EVENTS.length)];
                      draft.currentEvent = staticEvent;
                      addLog(`An event has occurred: ${staticEvent.title}`);
                  }
              }
          }
      };

      if (activity) {
        // Activity week is a single week advance
        draft.time.week += 1;
        draft.playerStats.money -= activity.cost;
        draft.playerStats.energy = Math.min(100, draft.playerStats.energy + activity.effects.energy);
        const happinessGain = activity.effects.happiness;
        draft.playerStats.happiness = Math.min(100, draft.playerStats.happiness + happinessGain);
        addLog(`Week ${draft.time.week}, Year ${draft.time.year}: You spent the week on '${activity.name}'. It was refreshing!`);
      } else {
        // Normal work week
        performSingleWeekUpdate();
      }

      if (draft.startingPerk === 'happy') draft.playerStats.happiness = Math.max(90, draft.playerStats.happiness);

    }));
  }, [addLog, updateJobOffers]);
  
  const handlePerformActivity = useCallback((activity: Activity) => {
      advanceWeek(activity);
      setIsActivitiesModalOpen(false);
  }, [advanceWeek]);
  
  const handleSelectHobby = useCallback((hobby: Hobby | null) => {
    setGameState(prev => produce(prev, draft => {
        if (hobby) {
            addLog(`You've started a new hobby: ${hobby.name}.`);
        } else if (draft.currentHobby) {
            addLog(`You've decided to stop your hobby: ${draft.currentHobby.name}.`);
        }
        draft.currentHobby = hobby;
    }));
    setIsHobbiesModalOpen(false);
  }, [addLog]);

  const handleEnrollInEducation = useCallback((education: Education) => {
    setGameState(prev => produce(prev, draft => {
        if (draft.playerStats.money < education.cost) return;

        draft.playerStats.money -= education.cost;
        addLog(`You enrolled in '${education.name}', spending $${education.cost}.`);

        // Time passes, stats drain, but no salary or events
        for (let i = 0; i < education.durationWeeks; i++) {
            draft.time.week += 1;
            if (draft.time.week > 52) {
                draft.time.week = 1;
                draft.time.year += 1;
            }
            if (draft.startingPerk !== 'testing') {
                draft.playerStats.energy = Math.max(0, draft.playerStats.energy - 5); // Studying is less draining
                draft.playerStats.happiness = Math.max(0, draft.playerStats.happiness - 3);
            }
        }
        
        // Grant rewards
        const skillToImprove = draft.skills[education.skill];
        if (skillToImprove) {
            let xpGained = education.rewards.xp;
            if(draft.startingPerk === 'testing') xpGained *= 4;
            skillToImprove.xp += xpGained;
        }
        if (education.rewards.personalBrand) {
            draft.playerStats.personalBrand += education.rewards.personalBrand;
        }
        if (education.rewards.awardTrait && !draft.activeTraits.some(t => t.id === education.rewards.awardTrait?.id)) {
            draft.activeTraits.push(education.rewards.awardTrait);
        }
        
        addLog(`You successfully completed '${education.name}' after ${education.durationWeeks} week(s).`);
        
        if (draft.startingPerk === 'happy') draft.playerStats.happiness = Math.max(90, draft.playerStats.happiness);
    }));
    setIsEducationModalOpen(false);
  }, [addLog]);

  useEffect(() => {
    if (gameState.isGeneratingEvent && !isFetchingEvent.current) {
        isFetchingEvent.current = true;
        generateGameEvent(gameState)
            .then(result => {
                if (result === 'RATE_LIMIT_ERROR') {
                    addLog("Whoa, too fast! The AI needs a moment to catch its breath. Please wait a few seconds.");
                    setApiCooldown(true);
                    setTimeout(() => setApiCooldown(false), 5000); // 5-second cooldown
                } else if (result) {
                    addLog(`An event has occurred: ${result.title}`);
                    setGameState(prev => produce(prev, draft => { draft.currentEvent = result; }));
                }
            })
            .finally(() => {
                isFetchingEvent.current = false;
                setGameState(prev => produce(prev, draft => { draft.isGeneratingEvent = false; }));
            });
    }
  }, [gameState, addLog]);

  const handleChoice = useCallback((choice: GameEventChoice) => {
    setGameState(prev => produce(prev, draft => {
      if (!draft.currentEvent) return;
      const { effects } = choice;
      let logMessage = `You chose to "${choice.text}".`;
      
      if(effects.energy != null) {
          const energyChange = Number(effects.energy);
          if (!(draft.startingPerk === 'testing' && energyChange < 0)) {
             draft.playerStats.energy = Math.max(0, Math.min(100, draft.playerStats.energy + energyChange));
          }
      }
      if(effects.happiness != null) {
          let happinessChange = Number(effects.happiness);
          if (draft.startingPerk === 'testing') {
              if (happinessChange < 0) happinessChange = 0;
          }
          draft.playerStats.happiness = Math.max(0, Math.min(100, draft.playerStats.happiness + happinessChange));
      }
      if(effects.money != null) {
          draft.playerStats.money += Number(effects.money);
      }
      if(effects.personalBrand != null) {
        const initialBrandGain = Number(effects.personalBrand);
        let finalBrandGain = initialBrandGain;
        if (draft.startingPerk === 'influencer' && initialBrandGain > 0) {
            finalBrandGain = Math.floor(initialBrandGain * 1.5);
        }
        draft.playerStats.personalBrand += finalBrandGain;
      }
      if (effects.luck != null) {
        draft.playerStats.luck += Number(effects.luck);
      }
      if (effects.xp?.skill && effects.xp.amount != null && draft.skills[effects.xp.skill as keyof GameState['skills']]) {
        let xpGained = Number(effects.xp.amount);
        if (draft.startingPerk === 'testing') xpGained *= 4;
        draft.skills[effects.xp.skill as keyof GameState['skills']].xp += xpGained;
      }
      if (effects.addTrait && !draft.activeTraits.some(t => t.id === effects.addTrait?.id)) {
          draft.activeTraits.push(effects.addTrait);
          logMessage += ` You gained the '${effects.addTrait.name}' trait.`;
      }
      if(effects.removeTraitId) {
          draft.activeTraits = draft.activeTraits.filter(t => t.id !== effects.removeTraitId);
      }
      if(effects.newJob) {
          draft.currentJob = effects.newJob;
          logMessage += ` You landed a new job as a ${effects.newJob.title} at ${effects.newJob.company}!`;
      }
      
      if (draft.startingPerk === 'happy') draft.playerStats.happiness = Math.max(90, draft.playerStats.happiness);

      addLog(logMessage);
      draft.currentEvent = null;
    }));
  }, [addLog]);

  const handlePerformanceReviewChoice = (decision: 'accept' | 'decline' | 'negotiate') => {
    setGameState(prev => produce(prev, draft => {
        if(decision === 'accept') {
            draft.currentJob = draft.performanceReview?.promotionOffer || draft.currentJob;
            addLog(`You accepted the offer and are now a ${draft.currentJob?.title}!`);
        } else if (decision === 'decline') {
            draft.currentJob = null;
            draft.gamePhase = 'job-market';
            addLog("You declined the offer. It's time to find a new job.");
            updateJobOffers();
        } else if (decision === 'negotiate') {
            const negotiationSuccessChance = (draft.playerStats.luck + draft.playerStats.personalBrand) / 200; // e.g. 50 luck + 50 brand = 50% chance
            if(Math.random() < negotiationSuccessChance && draft.performanceReview?.promotionOffer) {
                draft.performanceReview.promotionOffer.salary = Math.floor(draft.performanceReview.promotionOffer.salary * 1.15);
                draft.performanceReview.negotiationResult = 'success';
                addLog("Your negotiation was successful! You secured a higher salary.");
            } else {
                draft.performanceReview = { promotionOffer: null, negotiationResult: 'fail' };
                addLog("Negotiation failed! The company withdrew their offer.");
            }
            return;
        }
        draft.time.week = 1;
        draft.time.year += 1;
        draft.performanceReview = undefined;
        if(decision !== 'decline') draft.gamePhase = 'playing';
    }));
  };

  const handleAcceptNewJob = (job: Job) => {
    setGameState(prev => produce(prev, draft => {
        draft.currentJob = job;
        draft.gamePhase = 'playing';
        draft.jobOffers = [];
        addLog(`You accepted a new job as a ${job.title} at ${job.company}.`);
    }));
  };
  
  const handleSummonChaos = useCallback(() => {
    if (gameState.isGeneratingEvent || gameState.currentEvent) return;
    addLog("Summoning a chaotic event...");
    setGameState(prev => produce(prev, draft => {
        draft.isGeneratingEvent = true;
    }));
  }, [addLog, gameState.isGeneratingEvent, gameState.currentEvent]);

  const handleRestart = () => {
    localStorage.removeItem(SAVE_GAME_KEY);
    setGameState(INITIAL_GAME_STATE);
  }
  
  const handleContinueGame = () => {
    if (savedGame) {
      setGameState(savedGame);
      setSavedGame(null);
    }
  };

  const handleNewGame = () => {
    localStorage.removeItem(SAVE_GAME_KEY);
    setSavedGame(null);
    setGameState(INITIAL_GAME_STATE);
  };
  
  const { playerStats, skills, currentJob, time, log, gamePhase, currentEvent, isGeneratingEvent, activeTraits, salaryBonus, jobOffers, performanceReview, currentHobby, startingPerk } = gameState;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p className="text-2xl font-bold animate-pulse">Loading Simulator...</p>
      </div>
    );
  }

  if (savedGame) {
    return <LoadGamePrompt onContinue={handleContinueGame} onNewGame={handleNewGame} />;
  }

  if (gamePhase === 'perk-selection') return <PerkSelectionScreen onSelectPerk={handleSelectPerk} />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      {currentEvent && <EventModal event={currentEvent} onChoice={handleChoice} playerLuck={playerStats.luck} startingPerk={startingPerk} />}
      {gamePhase === 'job-market' && <JobMarketModal offers={jobOffers} onAccept={handleAcceptNewJob} onClose={() => setGameState(produce(gameState, d => {d.gamePhase = 'playing'}))} />}
      {gamePhase === 'performance-review' && performanceReview && <PerformanceReviewModal offer={performanceReview.promotionOffer} negotiationResult={performanceReview.negotiationResult} onAccept={() => handlePerformanceReviewChoice('accept')} onDecline={() => handlePerformanceReviewChoice('decline')} onNegotiate={() => handlePerformanceReviewChoice('negotiate')} />}
      <ActivitiesModal isOpen={isActivitiesModalOpen} onClose={() => setIsActivitiesModalOpen(false)} onSelectActivity={handlePerformActivity} activities={PERSONAL_ACTIVITIES} playerMoney={playerStats.money} />
      <EducationModal isOpen={isEducationModalOpen} onClose={() => setIsEducationModalOpen(false)} onEnroll={handleEnrollInEducation} educationOptions={EDUCATION_OPTIONS} playerMoney={playerStats.money} playerSkills={skills} />
      <HobbiesModal isOpen={isHobbiesModalOpen} onClose={() => setIsHobbiesModalOpen(false)} onSelectHobby={handleSelectHobby} hobbies={HOBBIES} currentHobby={currentHobby} />


      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">IT Career Simulator</h1>
                <p className="text-gray-400">Your life as a dev awaits...</p>
            </div>
            <div className="font-mono text-xl sm:text-2xl text-blue-300 bg-gray-800 px-4 py-2 rounded-lg mt-4 sm:mt-0">
                Year: {time.year} / Week: {time.week}
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="lg:col-span-1 space-y-6">
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Player Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <StatDisplay icon={<EnergyIcon />} label="Energy" value={`${playerStats.energy}/100`} />
                      <StatDisplay icon={<HappinessIcon />} label="Happiness" value={`${playerStats.happiness}/100`} />
                      <StatDisplay icon={<MoneyIcon />} label="Money" value={`$${playerStats.money.toLocaleString()}`} />
                      <StatDisplay icon={<BrandIcon />} label="Personal Brand" value={playerStats.personalBrand} />
                      <StatDisplay icon={<CloverIcon />} label="Luck" value={playerStats.luck} />
                      {currentHobby && <div className="col-span-2"><StatDisplay icon={<HobbyIcon />} label="Current Hobby" value={currentHobby.name} /></div>}
                    </div>
                </div>

                {activeTraits.length > 0 && (
                  <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                      <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Traits</h2>
                      {activeTraits.map(trait => (
                          <div key={trait.id} className="mb-2">
                              <p className={`font-semibold ${trait.type === 'positive' ? 'text-green-400' : 'text-red-400'}`}>{trait.name}</p>
                              <p className="text-sm text-gray-400">{trait.description}</p>
                          </div>
                      ))}
                  </div>
                )}

                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Current Job</h2>
                    {currentJob ? <>
                        <p className="text-lg font-semibold">{currentJob.title}</p>
                        <p className="text-md text-gray-400">{currentJob.company}</p>
                        <p className="text-lg font-mono text-green-400 mt-2">+${currentJob.salary.toLocaleString()}/week {gameState.startingPerk === 'rich' && `(+${Math.floor((salaryBonus || 0) * 100)}% bonus)`}</p>
                    </> : <p className="text-lg text-yellow-400">Unemployed</p>}
                </div>

                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Skills</h2>
                    <div className="space-y-4">
                        {Object.entries(skills).map(([key, skill]) => <SkillComponent key={key} skill={skill} />)}
                    </div>
                </div>
            </aside>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Actions</h2>
                    {gamePhase === 'game-over' ? (
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-red-500 mb-4">Game Over</h3>
                            <button onClick={handleRestart} className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Restart</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            <button onClick={() => advanceWeek()} disabled={isGeneratingEvent || !!currentEvent || gamePhase !== 'playing' || apiCooldown} className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center col-span-2">
                                {isGeneratingEvent ? 'Generating Event...' : apiCooldown ? 'AI is Catching Its Breath...' : "Advance Week"}
                            </button>
                             {startingPerk === 'testing' && (
                                <button
                                    onClick={handleSummonChaos}
                                    disabled={isGeneratingEvent || !!currentEvent || gamePhase !== 'playing'}
                                    className="w-full px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center col-span-2"
                                >
                                    Summon Chaos Event
                                </button>
                            )}
                            <button onClick={() => { updateJobOffers(); setGameState(produce(gameState, d => { d.gamePhase = 'job-market' }))}} disabled={gamePhase !== 'playing'} className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600">
                                Find New Job
                            </button>
                             <button onClick={() => setIsActivitiesModalOpen(true)} disabled={gamePhase !== 'playing'} className="w-full px-6 py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:bg-gray-600">
                                Personal Activities
                            </button>
                            <button onClick={() => setIsHobbiesModalOpen(true)} disabled={gamePhase !== 'playing'} className="w-full px-6 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600">
                                Manage Hobby
                            </button>
                            <button onClick={() => setIsEducationModalOpen(true)} disabled={gamePhase !== 'playing'} className="w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-600">
                                Education & Training
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 p-5 rounded-lg shadow-lg h-96">
                    <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">Event Log</h2>
                    <div className="h-full overflow-y-auto pr-2">
                        <ul className="space-y-2 text-sm">
                            {log.map((entry, index) => (
                                <li key={index} className={`font-mono ${index === 0 ? 'text-green-300' : 'text-gray-400'}`}>
                                    <span className="text-gray-500 mr-2">&gt;</span>{entry}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;
