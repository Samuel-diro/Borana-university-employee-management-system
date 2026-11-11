import React from 'react';
import { GraduationCap, Shield } from 'lucide-react';

interface FooterProps {
  onOpenProjectInfo: () => void;
  onOpenCodeExplorer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProjectInfo, onOpenCodeExplorer }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 no-print mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-2">
          <img 
            src="/src/assets/images/borana_university_crest_1794424747251.jpg" 
            alt="Crest" 
            className="w-5 h-5 rounded-full"
            referrerPolicy="no-referrer"
          />
          <span>
            &copy; {new Date().getFullYear()} <strong>Borana University</strong> &middot; All Rights Reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button 
            onClick={onOpenProjectInfo}
            className="text-slate-600 hover:text-[#0a2540] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#c59b27]" /> Group 3 Project Details
          </button>
          <span>&middot;</span>
          <button 
            onClick={onOpenCodeExplorer}
            className="text-slate-600 hover:text-[#0a2540] font-mono transition-colors cursor-pointer"
          >
            PHP & MySQL Database
          </button>
          <span>&middot;</span>
          <span className="font-mono text-slate-400">Yabello Campus &middot; Nov 2026</span>
        </div>
      </div>
    </footer>
  );
};
