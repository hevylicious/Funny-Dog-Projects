
import React from 'react';
import type { Skill as SkillType } from '../types';
import ProgressBar from './ProgressBar';

interface SkillProps {
  skill: SkillType;
}

const SkillComponent: React.FC<SkillProps> = ({ skill }) => {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-300">{skill.name}</span>
        <span className="text-xs font-mono text-gray-400">
          Lvl {skill.level} ({skill.xp}/{skill.xpToNextLevel})
        </span>
      </div>
      <ProgressBar value={skill.xp} max={skill.xpToNextLevel} colorClass="bg-green-500" />
    </div>
  );
};

export default SkillComponent;
