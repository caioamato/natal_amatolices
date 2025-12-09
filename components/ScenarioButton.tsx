import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScenarioButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  subLabel: string;
  colorClass: string;
  hoverAnimationClass: string;
  disabled?: boolean;
}

const ScenarioButton: React.FC<ScenarioButtonProps> = ({ 
  onClick, 
  icon: Icon, 
  label, 
  subLabel, 
  colorClass, 
  hoverAnimationClass,
  disabled 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group flex flex-col items-center justify-center p-6 
        rounded-2xl shadow-xl transition-all duration-300
        text-white w-full md:w-64 h-48
        disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
        ${colorClass} ${hoverAnimationClass}
      `}
    >
      <div className="mb-4 p-3 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
        <Icon size={48} className="text-white drop-shadow-md" />
      </div>
      <span className="text-xl font-bold font-['Roboto'] mb-1 text-center leading-tight">
        {label}
      </span>
      <span className="text-sm opacity-90 font-['Roboto'] text-center">
        {subLabel}
      </span>
    </button>
  );
};

export default ScenarioButton;